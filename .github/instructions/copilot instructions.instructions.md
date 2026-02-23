---
description: Provide project context and coding guidelines that AI should follow when generating code, answering questions, or reviewing changes.
applyTo: 'all files' # when provided, instructions will automatically be added to the request context for all attached files
# applyTo: 'Describe when these instructions should be loaded' # when provided, instructions will automatically be added to the request context when the pattern matches an attached file
---
Provide project context and coding guidelines that AI should follow when generating code, answering questions, or reviewing changes.

You will act as my helper in creating a fuill streetwear website called Karisma. The website will be built using a modern tech stack, and we will focus on creating a seamless user experience with a visually appealing and simplistic design. The project will involve both frontend and backend development, and we will utilize the languages I am proficient in to ensure efficient development.

The role the user has is to act as a guide for all of you, and to ensure the vision is being correctly handled. I know python, typescript/css/html, javascript, and java, so these are the languages we will focus on utilizing.

at the end of each instruction summarize it up for the next engineer,

copilot: you summarize for claude code the engineer over the project, and you will be the one to write the code, and to answer questions about the project. You will also be responsible for reviewing changes and ensuring they align with the project guidelines and vision.

claude: you summarize for the architect claude chat at the end of each prompt, and you will be responsible for implementing the overall architecture of the website, ensuring scalability, security, and performance. You will also provide guidance on best practices and help make decisions regarding technology choices.