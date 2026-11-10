# Vyxia learning chat experience

## User experience
- Replace the curriculum-only first screen with an Arabic-first, responsive tutor workspace: compact Vyxia navigation, searchable recent conversations and saved quiz history, and a focused ChatGPT-style transcript/composer.
- Let each student start/switch to independently addressable conversations, select one of the existing tutor models and a textbook lesson, and restore the selected conversation after refresh.
- Add sign-in/profile setup and protect personal histories; retain the existing lesson catalog and owner-scoped database records.
- Support attached image/PDF files in prompts and add a chat action that asks the selected tutor to prepare an infographic prompt before generating a streamed image with GPT Image 2.5. Keep the generated image visible in its conversation.
- Add a saved-quiz history/detail view using existing account-owned quiz records, without changing the prior objective-answer grading policy.

## Implementation
- Use existing AI Elements chat primitives for messages, transcript, composer and loading; preserve the current three-model tutor selector and Lovable AI Gateway server boundary.
- Add file-based TanStack routes for public sign-in, the protected chat shell, route-keyed thread pages and saved quiz details; keep `/` useful and connect signed-in students to their active chat.
- Create a private Lovable Cloud Storage bucket and owner-folder policies. Upload files through the Storage API; send authenticated, validated file content to the selected tutor and store durable attachment references with the owning conversation.
- Extend the existing authenticated chat handler for lesson/file context and add authenticated server routes for infographic-prompt preparation and streamed GPT Image 2.5 generation.

## Verification
- Test the live signed-out/signed-in entry paths, thread creation/switch/refresh, lesson/model selection, upload handling, quiz-history access and image-stream error/completion states where credentials and gateway availability allow.
- Run the relevant tests and full lint/build checks, then inspect the rendered desktop and mobile workspace.
