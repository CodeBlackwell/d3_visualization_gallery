#!/usr/bin/env node

import OpenAI from 'openai';
import fs from 'fs/promises';
import path from 'path';

const SYSTEM_PROMPT = "Translate this HTML into JavaScript that dynamically generates the visualization. Use D3.js for rendering, fetch JSON data for nodes and links, and implement modular ES6 functions for scalability. Include error handling for container and data issues, and ensure the visualization supports customization via parameters like width, height, and data source. Export the component by default. Your Response should ONLY BE JavaScript code with no additional Explanation.";

class Logger {
    constructor(isVerbose = false) {
        this.isVerbose = isVerbose;
        this.stages = new Map();
        this.currentStage = null;
    }

    startStage(stageName) {
        this.currentStage = stageName;
        this.stages.set(stageName, {
            startTime: Date.now(),
            completed: false
        });
        this.verbose(`Starting stage: ${stageName}`);
    }

    endStage(stageName) {
        const stage = this.stages.get(stageName);
        if (stage) {
            stage.completed = true;
            stage.endTime = Date.now();
            const duration = (stage.endTime - stage.startTime) / 1000;
            this.verbose(`Completed stage: ${stageName} (Duration: ${duration.toFixed(2)}s)`);
        }
    }

    stageProgress(message) {
        if (this.currentStage) {
            this.verbose(`[${this.currentStage}] ${message}`);
        } else {
            this.verbose(message);
        }
    }

    log(...args) {
        console.log(...args);
    }

    verbose(...args) {
        if (this.isVerbose) {
            const timestamp = new Date().toISOString();
            console.log(`[VERBOSE ${timestamp}]`, ...args);
        }
    }

    error(...args) {
        console.error('[ERROR]', ...args);
    }

    success(...args) {
        console.log('[SUCCESS]', ...args);
    }

    summarize() {
        if (this.isVerbose) {
            console.log('\nProcess Summary:');
            for (const [stageName, stage] of this.stages) {
                const status = stage.completed ? 'Completed' : 'Incomplete';
                const duration = stage.endTime ? 
                    `${((stage.endTime - stage.startTime) / 1000).toFixed(2)}s` : 
                    'Not finished';
                console.log(`- ${stageName}: ${status} (${duration})`);
            }
            console.log();
        }
    }
}

class OpenAITranslator {
    constructor(apiKey = process.env.OPENAI_API_KEY, logger = new Logger()) {
        if (!apiKey) {
            throw new Error('OpenAI API key is required. Set OPENAI_API_KEY environment variable or pass it to the constructor.');
        }
        this.openai = new OpenAI({ apiKey });
        this.logger = logger;
    }

    async generateResponse(prompt, options = {}) {
        try {
            this.logger.startStage('API Request Preparation');
            this.logger.stageProgress('Preparing prompt and options');
            this.logger.stageProgress(`Prompt preview: ${prompt.slice(0, 100)}...`);

            const defaultOptions = {
                model: 'gpt-4o',
                temperature: 0.1,
                max_tokens: 4000,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0,
            };

            const finalOptions = {
                ...defaultOptions,
                ...options,
                messages: [
                    { role: 'system', content: SYSTEM_PROMPT },
                    { role: 'user', content: prompt }
                ],
            };

            this.logger.stageProgress('Options configured');
            this.logger.endStage('API Request Preparation');

            this.logger.startStage('API Call');
            this.logger.stageProgress('Sending request to OpenAI API');
            const response = await this.openai.chat.completions.create(finalOptions);
            this.logger.stageProgress('Response received');
            this.logger.endStage('API Call');

            this.logger.startStage('Response Processing');
            this.logger.stageProgress('Extracting content from response');
            let content = response.choices[0].message.content;
            
            // Remove code block backticks if present
            if (content.startsWith('```') && content.endsWith('```')) {
                this.logger.stageProgress('Removing code block backticks');
                // Remove first line if it contains ```javascript or similar
                content = content.split('\n').slice(1).join('\n');
                // Remove the last line with ```
                content = content.split('\n').slice(0, -1).join('\n');
            }
            
            this.logger.stageProgress(`Generated code size: ${content.length} characters`);
            this.logger.endStage('Response Processing');

            return content;
        } catch (error) {
            this.logger.error('Error in generate response:', error);
            throw error;
        }
    }

    async generateConversationResponse(messages, options = {}) {
        try {
            this.logger.startStage('Conversation Processing');
            this.logger.stageProgress(`Processing conversation with ${messages.length} messages`);
            
            const defaultOptions = {
                model: 'gpt-4o',
                temperature: 0.1,
                max_tokens: 4000,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0,
            };

            const finalOptions = {
                ...defaultOptions,
                ...options,
                messages: [
                    { role: 'system', content: SYSTEM_PROMPT },
                    ...messages
                ],
            };
            this.logger.endStage('Conversation Processing');

            this.logger.startStage('API Call');
            this.logger.stageProgress('Sending conversation to OpenAI API');
            const response = await this.openai.chat.completions.create(finalOptions);
            this.logger.stageProgress('Response received');
            this.logger.endStage('API Call');

            this.logger.startStage('Response Processing');
            let content = response.choices[0].message.content;
            
            // Remove code block backticks if present
            if (content.startsWith('```') && content.endsWith('```')) {
                this.logger.stageProgress('Removing code block backticks');
                // Remove first line if it contains ```javascript or similar
                content = content.split('\n').slice(1).join('\n');
                // Remove the last line with ```
                content = content.split('\n').slice(0, -1).join('\n');
            }
            
            this.logger.stageProgress(`Generated response size: ${content.length} characters`);
            this.logger.endStage('Response Processing');

            return content;
        } catch (error) {
            this.logger.error('Error in conversation response:', error);
            throw error;
        }
    }
}

async function ensureDirectoryExists(dirPath) {
    try {
        await fs.access(dirPath);
    } catch {
        await fs.mkdir(dirPath, { recursive: true });
    }
}

async function processFile(inputPath, translator, logger, isInDirectory = false) {
    const fileName = path.basename(inputPath, '.html');
    const parentDir = path.dirname(inputPath);
    const subDir = path.join(parentDir, fileName);
    
    logger.startStage('Directory Setup');
    logger.stageProgress(`Creating subdirectory: ${subDir}`);
    await ensureDirectoryExists(subDir);
    logger.endStage('Directory Setup');

    const newHtmlPath = path.join(subDir, `${fileName}.html`);
    const outputFile = path.join(subDir, `${fileName}.js`);

    try {
        logger.startStage('File Reading');
        logger.stageProgress(`Reading from: ${inputPath}`);
        const htmlContent = await fs.readFile(inputPath, 'utf8');
        logger.stageProgress(`Read ${htmlContent.length} characters`);
        logger.endStage('File Reading');

        logger.startStage('Translation');
        logger.stageProgress('Generating JavaScript code');
        const jsCode = await translator.generateResponse(htmlContent);
        logger.endStage('Translation');

        logger.startStage('File Writing');
        // Copy original HTML to new location
        logger.stageProgress(`Copying HTML to: ${newHtmlPath}`);
        await fs.copyFile(inputPath, newHtmlPath);
        
        // Write JS file
        logger.stageProgress(`Writing JS to: ${outputFile}`);
        await fs.writeFile(outputFile, jsCode);
        logger.stageProgress(`Written ${jsCode.length} characters`);
        
        // If processing from directory, remove original HTML file
        if (isInDirectory) {
            logger.stageProgress(`Removing original HTML file: ${inputPath}`);
            await fs.unlink(inputPath);
        }
        logger.endStage('File Writing');

        logger.success(`Processed ${path.basename(inputPath)}:`);
        logger.success(`  HTML: ${newHtmlPath}`);
        logger.success(`  JS:   ${outputFile}`);
        
        return true;
    } catch (error) {
        logger.error(`Error processing ${inputPath}:`, error.message);
        return false;
    }
}

async function processDirectory(dirPath, translator, logger) {
    logger.startStage('Directory Processing');
    logger.stageProgress(`Scanning directory: ${dirPath}`);
    
    try {
        const files = await fs.readdir(dirPath);
        const htmlFiles = files.filter(file => file.endsWith('.html'));
        
        logger.stageProgress(`Found ${htmlFiles.length} HTML files`);
        
        if (htmlFiles.length === 0) {
            logger.error('No HTML files found in directory');
            return;
        }

        for (let i = 0; i < htmlFiles.length; i++) {
            const htmlFile = htmlFiles[i];
            const inputFile = path.join(dirPath, htmlFile);

            logger.startStage(`File ${i + 1}/${htmlFiles.length}`);
            logger.stageProgress(`Processing: ${htmlFile}`);

            await processFile(inputFile, translator, logger, true);
            logger.endStage(`File ${i + 1}/${htmlFiles.length}`);
            
            // If not the last file, add a small delay
            if (i < htmlFiles.length - 1) {
                logger.stageProgress('Waiting before next file...');
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
    } catch (error) {
        logger.error('Error processing directory:', error.message);
        throw error;
    } finally {
        logger.endStage('Directory Processing');
    }
}

async function main() {
    try {
        const args = process.argv.slice(2);
        const usage = `
Usage: openai_translator <command> [options]

Commands:
  translate <input_path>    Translate HTML file or directory to JavaScript
                           Creates a subdirectory for each HTML file containing:
                           - Original HTML file
                           - Generated JavaScript file
  chat                     Start an interactive chat session

Options:
  --help, -h     Show this help message
  --verbose, -v  Enable verbose logging
`;

        if (args.includes('--help') || args.includes('-h')) {
            console.log(usage);
            process.exit(0);
        }

        const isVerbose = args.includes('--verbose') || args.includes('-v');
        const cleanArgs = args.filter(arg => !['--verbose', '-v'].includes(arg));
        
        const logger = new Logger(isVerbose);
        const translator = new OpenAITranslator(process.env.OPENAI_API_KEY, logger);

        if (cleanArgs.length === 0) {
            logger.error('No command specified');
            console.log(usage);
            process.exit(1);
        }

        switch (cleanArgs[0]) {
            case 'translate': {
                if (cleanArgs.length < 2) {
                    logger.error('Input path is required');
                    console.log(usage);
                    process.exit(1);
                }

                const inputPath = cleanArgs[1];
                
                try {
                    const stats = await fs.stat(inputPath);
                    
                    if (stats.isDirectory()) {
                        await processDirectory(inputPath, translator, logger);
                    } else {
                        await processFile(inputPath, translator, logger, false);
                    }
                } catch (error) {
                    logger.error(`Error accessing path ${inputPath}:`, error.message);
                    process.exit(1);
                }
                
                logger.summarize();
                break;
            }

            case 'chat': {
                logger.log('Starting chat session (Type "exit" to quit)');
                logger.log('Enter your HTML or questions:');

                const readline = (await import('readline')).default.createInterface({
                    input: process.stdin,
                    output: process.stdout
                });

                const messages = [];

                const askQuestion = () => {
                    readline.question('> ', async (input) => {
                        if (input.toLowerCase() === 'exit') {
                            logger.startStage('Session Cleanup');
                            logger.stageProgress('Closing chat session');
                            readline.close();
                            logger.endStage('Session Cleanup');
                            logger.summarize();
                            return;
                        }

                        try {
                            logger.startStage('Chat Processing');
                            logger.stageProgress('Processing user input');
                            messages.push({ role: 'user', content: input });
                            
                            const response = await translator.generateConversationResponse(messages);
                            logger.log('\nResponse:', response, '\n');
                            messages.push({ role: 'assistant', content: response });
                            logger.endStage('Chat Processing');
                            
                            askQuestion();
                        } catch (error) {
                            logger.error('Error:', error.message);
                            askQuestion();
                        }
                    });
                };

                askQuestion();
                break;
            }

            default:
                logger.error('Unknown command:', cleanArgs[0]);
                console.log(usage);
                process.exit(1);
        }
    } catch (error) {
        console.error('[ERROR] Fatal:', error.message);
        process.exit(1);
    }
}

main();
