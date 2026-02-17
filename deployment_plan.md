# Deployment Plan for Render

This guide outlines the steps to deploy your **Traxxia AI Assistant** custom server to [Render](https://render.com/).

## 1. Preparation (Done)
-   **Dependencies**: I have added `tsx` to your development dependencies to ensure the start command works reliably in the cloud.
-   **Start Script**: Your `package.json` already has `start:server` which runs `src/server.ts`.

## 2. Push to GitHub
Ensure your latest code (including the new `package.json` and `deployment_plan.md`) is pushed to your GitHub repository.
```bash
git add .
git commit -m "Prepare for deployment"
git push
```

## 3. Create Web Service on Render
1.  Log in to your [Render Dashboard](https://dashboard.render.com/).
2.  Click **New +** and select **Web Service**.
3.  Connect your GitHub repository.

## 4. Configuration
Configure the service with the following settings:

| Setting | Value |
| :--- | :--- |
| **Name** | `traxxia-ai-assistant` (or your preferred name) |
| **Region** | Choose the one closest to your users (e.g., Singapore, Frankfurt) |
| **Branch** | `main` (or your working branch) |
| **Root Directory** | `.` (Leave blank) |
| **Runtime** | **Node** |
| **Build Command** | `npm install` |
| **Start Command** | `npm run start:server` |

> **Note on Start Command**: We are using `npm run start:server` which executes `npx tsx src/server.ts`. This runs TypeScript directly. For a large scale production app, you might want to compile to JS first, but this is perfect for your current setup.

## 5. Environment Variables
You **MUST** add your environment variables in the Render Dashboard under the **Environment** tab.

Copy these values from your local `.env`:

| Key | Value Description |
| :--- | :--- |
| `GROQ_API_KEY` | Your Groq API Key |
| `MONGO_URI` | Your MongoDB Connection String |
| `PORT` | `4111` (Render will override this automatically, but good to have) |
| `OPENAI_API_KEY` | (If you are using OpenAI models) |
| `ANTHROPIC_API_KEY` | (If you are using Anthropic models) |

**Important**: Do NOT check "Generate .env file". Just add them as key-value pairs.

## 6. Deploy
1.  Click **Create Web Service**.
2.  Render will start building your app.
3.  Watch the logs. You should see:
    ```
    Server running on http://localhost:10000
    ```
    (Render uses port 10000 by default internally).

## 7. Verification
Once deployed, Render will verify the service is live.
Your API URL will be something like: `https://traxxia-ai-assistant.onrender.com`.

You can test it using Postman or your frontend:
-   **URL**: `https://<your-app>.onrender.com/api/chat`
-   **Method**: `POST`
-   **Headers**: `x-business-id: <your-business-id>`, `Content-Type: application/json`
-   **Body**: `{"message": "Hello"}`
