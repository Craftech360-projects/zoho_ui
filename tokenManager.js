const { supabase, createClient } = require('@supabase/supabase-js');
const fetch = require('node-fetch-commonjs');
// globalThis.fetch = fetch;
// global.fetch = fetch;

let accessToken = null;
let refreshToken = null;

var environment = {
  supabase: {
    url: 'https://jypkclsiqvkatajjvltb.supabase.co',
    key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5cGtjbHNpcXZrYXRhamp2bHRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTAwMTQ1OTcsImV4cCI6MjAwNTU5MDU5N30.hGY8ddFue0f2gnHy-Pd8C_1dN9pyGPCZXhJ52sODrNE',
    brainId: '549b3460-9a9f-4e93-979e-87b10c598efb',
    chatId: 'fa49a083-864a-40cf-a405-12112c36dfd7',
    model: 'gpt-3.5-turbo-0613',
    temperature: 0,
    max_tokens: 150,
  },
  url: {
    questionUrl: `http://localhost:5050/chat/fa49a083-864a-40cf-a405-12112c36dfd7/question?brain_id=`,
  },
  elevenLabs: {
    modelId: '21m00Tcm4TlvDq8ikWAM',
    url: 'https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM?optimize_streaming_latency=0',
    apiKey: '3c292dd7e16bbc3f07e8c1743fff55e5',
  },
}

var supabaseClient = createClient(
  environment.supabase.url,
  environment.supabase.key
)

async function getAccessToken() {
  // If access token is not available or expired, fetch a new one
  if (!refreshToken) {
    await fetchAccessToken();
    startTokenRefreshTimer();
  }

  return accessToken;
}

async function fetchAccessToken() {
  console.log(global.fetch);
  console.log("calling to get token");
  try {
    console.log("calling to get token");
    supabaseClient.auth.signInWithPassword({
      email: 'abilashs003@gmail.com',
      password: 'xp258LEFbVbLNvi',
    }).then(response => {
      accessToken = response.data.session.access_token;
      refreshToken = response.data.session.refresh_token;
    });


    // fetch("https://jypkclsiqvkatajjvltb.supabase.co/auth/v1/token?grant_type=password", {
    //   headers: {
    //     "accept": "*/*",
    //     "accept-language": "en-US,en;q=0.9",
    //     "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5cGtjbHNpcXZrYXRhamp2bHRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTAwMTQ1OTcsImV4cCI6MjAwNTU5MDU5N30.hGY8ddFue0f2gnHy-Pd8C_1dN9pyGPCZXhJ52sODrNE",
    //     "authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5cGtjbHNpcXZrYXRhamp2bHRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTAwMTQ1OTcsImV4cCI6MjAwNTU5MDU5N30.hGY8ddFue0f2gnHy-Pd8C_1dN9pyGPCZXhJ52sODrNE",
    //     "cache-control": "no-cache",
    //     "content-type": "application/json;charset=UTF-8",
    //     "pragma": "no-cache",
    //     "sec-ch-ua": "\"Not/A)Brand\";v=\"99\", \"Google Chrome\";v=\"115\", \"Chromium\";v=\"115\"",
    //     "sec-ch-ua-mobile": "?1",
    //     "sec-ch-ua-platform": "\"Android\"",
    //     "sec-fetch-dest": "empty",
    //     "sec-fetch-mode": "cors",
    //     "sec-fetch-site": "cross-site",
    //     "x-client-info": "supabase-js/2.31.0",
    //     "Referer": "http://localhost:4200/",
    //     "Referrer-Policy": "strict-origin-when-cross-origin"
    //   },
    //   body: "{\"email\":\"abilashs003@gmail.com\",\"password\":\"xp258LEFbVbLNvi\",\"gotrue_meta_security\":{}}",
    //   method: "POST"
    // }).then(response => {
    //   accessToken = response.data.session.access_token;
    //   refreshToken = response.data.session.refresh_token;
    // });

    // response.data.access_token;
  } catch (error) {
    console.log(error);
    throw new Error('Failed to fetch access token: ' + error.message);
  }
}

function startTokenRefreshTimer() {
  // Refresh the token every 2 minutes
  const refreshTokenInterval = 2 * 60 * 1000;
  setInterval(async () => {
    try {
      accessToken = await fetchAccessToken();
      console.log('Access token refreshed:', refreshToken);
    } catch (error) {
      console.error('Failed to refresh access token:', error.message);
    }
  }, refreshTokenInterval);
}


module.exports = {
  getAccessToken
}
