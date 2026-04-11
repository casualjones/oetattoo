To build an effective web app for **oetattoos.com** using the **Photopea API**, you should follow a structured AI-assisted development workflow: **Plan → Act → Review → Repeat**. Instead of asking the AI to build the entire app in one go, break the task into small, verifiable pieces.

Below is a highly effective prompt designed for **Visual Studio Code Copilot Chat**. It follows the "Goals + Rules + Examples + Tests" model to provide the AI with necessary guardrails.

### The Recommended Prompt for Copilot Chat

> **Context:** I am working on my website, `www.oetattoos.com`, which is hosted on **GitHub Pages** (static site) using the repository `casualjones/oetattoo`. I want to build a tool that turns uploaded hand-drawn tattoo sketches into professional stencils or vectors using the **Photopea API**.
>
> **Goal:** Create a new page (or update `tools.html`) with an interface that allows users to upload an image, processes it through a Photopea iframe, and allows them to download or print the result.
>
> **Step 1: Planning Phase**
> Before writing any code, please provide a technical plan that covers:
> 1. How to implement a file upload input that converts the local file into a **Data URI** to pass to Photopea.
> 2. The **JSON configuration object** required to open Photopea in an iframe with the uploaded image.
> 3. A **Photopea script** to be executed automatically after loading to convert the image to a stencil (e.g., desaturate, high pass filter, thresholding) or to vectorize it.
> 4. How to handle the **"Save" event** without a backend (since this is GitHub Pages), likely using client-side download triggers or `postMessage` to retrieve the processed image from the iframe.
>
> **Rules & Constraints:**
> - **Language:** Use vanilla JavaScript and HTML (consistent with the existing repo).
> - **No Backend:** Ensure all processing and "saving" occurs client-side, as GitHub Pages does not support server-side scripts like PHP.
> - **UI:** The Photopea editor should be embedded in an `<iframe>`.
> - **Error Handling:** Include checks for unsupported file types and Photopea loading failures.
>
> **Deliverable:** First, give me the architecture plan. Once I approve it, we will generate the code for the HTML structure and the JavaScript integration logic one piece at a time.

---

### Implementation Tips for VS Code

*   **Use a Prompt File:** You can save this prompt as a `.prompt.md` file in your `.github/prompts` folder. This allows you to reuse it by typing `/` in the Copilot Chat.
*   **Handle "Hallucinations":** AI may struggle with specific API execution details. If the generated code doesn't work, ask Copilot: "Are you sure this matches the Photopea API specification for cross-origin messaging?".
*   **Incremental Building:** After the plan is approved, ask for the code in stages:
    1.  The HTML/CSS for the upload interface.
    2.  The JavaScript logic to encode the image and launch the Photopea iframe.
    3.  The specific Photopea script (Action) for the stencil effect.
*   **Photopea "Whitelabel" Note:** If you want to hide the "colorful buttons" and ads in the embedded editor, the sources note that a Distributor account is required for **whitelabel mode**.
*   **Testing:** Since this involves cross-origin communication with an iframe, ensure your local testing environment handles **CORS** correctly, as Photopea requires specific headers to load files from your domain.