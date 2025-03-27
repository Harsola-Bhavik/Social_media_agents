const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { YoutubeTranscript } = require('youtube-transcript');
const axios = require('axios');
const { HfInference } = require('@huggingface/inference');
const { TwitterApi } = require('twitter-api-v2');
const { protect } = require('./middleware/auth');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const User = require('./models/User');
const Activity = require('./models/Activity');

// Initialize Hugging Face client (no token needed for free models)
const hf = new HfInference();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ message: 'Access denied' });
  
  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Auth routes
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });
    
    await user.save();
    
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    
    // Validate password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    
    // Create and assign token
    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1d' }
    );
    
    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// YouTube Agent routes
app.post('/api/youtube/summarize', protect, async (req, res) => {
  try {
    const { url } = req.body;
    
    // Extract video ID from URL
    const videoId = url.includes('youtube.com') 
      ? url.split('v=')[1].split('&')[0]
      : url.includes('youtu.be')
        ? url.split('youtu.be/')[1].split('?')[0]
        : null;
    
    if (!videoId) {
      return res.status(400).json({ message: 'Invalid YouTube URL' });
    }
    
    // Get video transcript
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);
    
    if (!transcript || transcript.length === 0) {
      return res.status(404).json({ message: 'No transcript available for this video' });
    }
    
    // Combine transcript text
    const transcriptText = transcript.map(item => item.text).join(' ');
    
    // Get video details
    const videoResponse = await axios.get(`https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${process.env.YOUTUBE_API_KEY}&part=snippet`);
    const videoTitle = videoResponse.data.items[0].snippet.title;
    
    // Use AI model to summarize (mock for now)
    const summary = `This is a summary of the video "${videoTitle}". The video discusses important topics related to the subject matter. Key points include the main arguments presented, supporting evidence, and conclusions drawn by the presenter.`;
    
    // Save activity
    const activity = new Activity({
      userId: req.user.id,
      type: 'youtube',
      title: videoTitle,
      content: summary,
      metadata: {
        videoId,
        url,
        transcriptLength: transcriptText.length,
      },
    });
    
    await activity.save();
    
    res.status(200).json({
      summary,
      videoTitle,
      videoId,
    });
  } catch (error) {
    console.error('YouTube summarization error:', error);
    res.status(500).json({ message: 'Error processing YouTube video' });
  }
});

app.post('/api/youtube/question', protect, async (req, res) => {
  try {
    const { videoId, question } = req.body;
    
    // In a real implementation, you would:
    // 1. Retrieve the transcript again (or from cache)
    // 2. Use an AI model to answer the question based on the transcript
    
    // Mock response for now
    const answer = `Based on the video content, the answer to your question "${question}" is that the topic is explained in detail around the middle of the video. The presenter provides several examples and case studies to illustrate the concept.`;
    
    res.status(200).json({ answer });
  } catch (error) {
    console.error('YouTube question error:', error);
    res.status(500).json({ message: 'Error processing question' });
  }
});

// Research AI routes
app.post('/api/research/generate', protect, async (req, res) => {
  try {
    const { topic, paperType, wordCount, includeSources, includeCharts } = req.body;
    
    // In a real implementation, you would:
    // 1. Use APIs to gather research data (Wikipedia, Semantic Scholar, arXiv)
    // 2. Process and structure the data
    // 3. Use an AI model to generate the paper
    
    // Mock response for now
    const researchPaper = `# ${topic}: A Comprehensive Analysis\n\n## Abstract\nThis research paper examines the current state and future implications of ${topic}...`;
    
    // Save activity
    const activity = new Activity({
      userId: req.user.id,
      type: 'research',
      title: topic,
      content: researchPaper,
      metadata: {
        paperType,
        wordCount,
        includeSources,
        includeCharts,
      },
    });
    
    await activity.save();
    
    res.status(200).json({
      paper: researchPaper,
      topic,
    });
  } catch (error) {
    console.error('Research paper generation error:', error);
    res.status(500).json({ message: 'Error generating research paper' });
  }
});

// Twitter Agent routes
app.post('/api/twitter/generate', protect, async (req, res) => {
  try {
    const { prompt } = req.body;
    
    // Prepare the prompt for tweet generation
    const tweetPrompt = `Generate a tweet about ${prompt}. Make it engaging and professional, include relevant hashtags:\n\nTweet:`;
    
    // Use GPT2 to generate tweet content
    const response = await hf.textGeneration({
      model: 'gpt2',
      inputs: tweetPrompt,
      parameters: {
        max_new_tokens: 60, // Limit to Twitter's length
        temperature: 0.7,   // Add some creativity
        top_k: 50,         // Limit vocabulary diversity
        do_sample: true    // Enable sampling for more creative outputs
      }
    });

    // Clean up the generated text
    let tweet = response.generated_text
      .replace(tweetPrompt, '')  // Remove the prompt
      .split('\n')[0]            // Take only the first line
      .trim();
    
    // Ensure the tweet isn't too long
    if (tweet.length > 280) {
      tweet = tweet.substring(0, 277) + '...';
    }

    // Add hashtags if none were generated
    if (!tweet.includes('#')) {
      const keywords = prompt.split(' ');
      const hashtags = keywords
        .filter(word => word.length > 3)
        .map(word => '#' + word.replace(/[^a-zA-Z0-9]/g, ''))
        .slice(0, 2)
        .join(' ');
      tweet = tweet + ' ' + hashtags;
    }
    
    // Save activity
    const activity = new Activity({
      userId: req.user.id,
      type: 'twitter',
      title: 'Tweet Generation',
      content: tweet,
      metadata: {
        prompt,
        model: 'gpt2',
        timestamp: new Date()
      },
    });
    
    await activity.save();
    
    res.status(200).json({
      tweet,
      prompt,
    });
  } catch (error) {
    console.error('Twitter content generation error:', error);
    res.status(500).json({ message: 'Error generating Twitter content' });
  }
});

app.post('/api/twitter/post', protect, async (req, res) => {
  try {
    const { content } = req.body;
    
    // Get user with Twitter tokens
    const user = await User.findById(req.user.id);
    
    if (!user?.twitterToken) {
      return res.status(401).json({ message: 'Twitter account not connected' });
    }
    
    // Create Twitter client with user's token
    const userClient = new TwitterApi(user.twitterToken);
    
    // Post the tweet
    const tweet = await userClient.v2.tweet(content);
    
    // Save activity
    const activity = new Activity({
      userId: req.user.id,
      type: 'twitter',
      title: 'Tweet Posted',
      content: content,
      metadata: {
        posted: true,
        tweetId: tweet.data.id,
        timestamp: new Date(),
      },
    });
    
    await activity.save();
    
    res.status(200).json({
      success: true,
      message: 'Tweet posted successfully',
      tweet: tweet.data,
    });
  } catch (error) {
    console.error('Twitter post error:', error);
    
    // Handle specific Twitter API errors
    if (error.code === 401) {
      return res.status(401).json({ message: 'Twitter authentication failed. Please reconnect your account.' });
    } else if (error.code === 403) {
      return res.status(403).json({ message: 'Tweet posting failed. This could be due to duplicate content or Twitter restrictions.' });
    } else if (error.code === 429) {
      return res.status(429).json({ message: 'Rate limit exceeded. Please try again later.' });
    }
    
    res.status(500).json({ message: 'Error posting tweet' });
  }
});

// Verify Twitter connection
app.get('/api/twitter/verify', protect, async (req, res) => {
  try {
    // Get user with Twitter tokens
    const user = await User.findById(req.user.id);
    
    if (!user?.twitterToken) {
      return res.status(200).json({ 
        connected: false,
        message: 'Twitter account not connected' 
      });
    }
    
    // Create Twitter client with user's tokens
    const userClient = new TwitterApi(user.twitterToken);
    
    // Verify credentials by getting user info
    await userClient.v2.me();
    
    res.status(200).json({
      connected: true,
      message: 'Twitter connection verified'
    });
  } catch (error) {
    console.error('Twitter verification error:', error);
    res.status(200).json({ 
      connected: false,
      message: 'Twitter connection failed' 
    });
  }
});

// Generate thread
app.post('/api/twitter/generate-thread', protect, async (req, res) => {
  try {
    const { topic, tweetCount = 3 } = req.body;
    
    // Prepare the prompt for thread generation
    const threadPrompt = `Generate a Twitter thread about ${topic}. Make it engaging and informative, with each tweet building on the previous one. Include relevant hashtags in the last tweet:\n\nThread:`;
    
    // Use GPT2 to generate thread content
    const response = await hf.textGeneration({
      model: 'gpt2',
      inputs: threadPrompt,
      parameters: {
        max_new_tokens: 60 * tweetCount, // Limit for multiple tweets
        temperature: 0.7,
        top_k: 50,
        do_sample: true
      }
    });

    // Split and clean up the generated text into tweets
    const tweets = response.generated_text
      .replace(threadPrompt, '')
      .split('\n')
      .map(tweet => tweet.trim())
      .filter(tweet => tweet.length > 0)
      .slice(0, tweetCount)
      .map((tweet, index) => {
        // Ensure each tweet fits Twitter's limit
        if (tweet.length > 280) {
          tweet = tweet.substring(0, 277) + '...';
        }
        // Add thread numbering
        return `${index + 1}/${tweetCount} ${tweet}`;
      });

    // Add hashtags to the last tweet if none were generated
    if (!tweets[tweets.length - 1].includes('#')) {
      const keywords = topic.split(' ');
      const hashtags = keywords
        .filter(word => word.length > 3)
        .map(word => '#' + word.replace(/[^a-zA-Z0-9]/g, ''))
        .slice(0, 2)
        .join(' ');
      tweets[tweets.length - 1] = tweets[tweets.length - 1] + ' ' + hashtags;
    }
    
    // Save activity
    const activity = new Activity({
      userId: req.user.id,
      type: 'twitter',
      title: 'Thread Generation',
      content: tweets.join('\n\n'),
      metadata: {
        topic,
        tweetCount,
        model: 'gpt2',
        timestamp: new Date()
      },
    });
    
    await activity.save();
    
    res.status(200).json({
      tweets,
      topic,
    });
  } catch (error) {
    console.error('Twitter thread generation error:', error);
    res.status(500).json({ message: 'Error generating Twitter thread' });
  }
});

// Post thread
app.post('/api/twitter/post-thread', protect, async (req, res) => {
  try {
    const { tweets } = req.body;
    
    if (!Array.isArray(tweets) || tweets.length === 0) {
      return res.status(400).json({ message: 'Invalid thread format' });
    }
    
    // Get user with Twitter tokens
    const user = await User.findById(req.user.id);
    
    if (!user?.twitterToken) {
      return res.status(401).json({ message: 'Twitter account not connected' });
    }
    
    // Create Twitter client with user's token
    const userClient = new TwitterApi(user.twitterToken);
    
    // Post the thread
    let previousTweetId = null;
    const postedTweets = [];
    
    for (const tweetContent of tweets) {
      const tweetData = previousTweetId 
        ? { text: tweetContent, reply: { in_reply_to_tweet_id: previousTweetId } }
        : { text: tweetContent };
      
      const tweet = await userClient.v2.tweet(tweetData);
      postedTweets.push(tweet.data);
      previousTweetId = tweet.data.id;
    }
    
    // Save activity
    const activity = new Activity({
      userId: req.user.id,
      type: 'twitter',
      title: 'Thread Posted',
      content: tweets.join('\n\n'),
      metadata: {
        posted: true,
        tweetIds: postedTweets.map(t => t.id),
        timestamp: new Date(),
      },
    });
    
    await activity.save();
    
    res.status(200).json({
      success: true,
      message: 'Thread posted successfully',
      tweets: postedTweets,
    });
  } catch (error) {
    console.error('Twitter thread posting error:', error);
    
    // Handle specific Twitter API errors
    if (error.code === 401) {
      return res.status(401).json({ message: 'Twitter authentication failed. Please reconnect your account.' });
    } else if (error.code === 403) {
      return res.status(403).json({ message: 'Thread posting failed. This could be due to duplicate content or Twitter restrictions.' });
    } else if (error.code === 429) {
      return res.status(429).json({ message: 'Rate limit exceeded. Please try again later.' });
    }
    
    res.status(500).json({ message: 'Error posting thread' });
  }
});

// User activity routes
app.get('/api/activities', protect, async (req, res) => {
  try {
    const activities = await Activity.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(10);
    
    res.status(200).json({ activities });
  } catch (error) {
    console.error('Activity retrieval error:', error);
    res.status(500).json({ message: 'Error retrieving activities' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something broke!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});