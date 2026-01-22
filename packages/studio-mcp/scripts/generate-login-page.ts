import { renderScreen } from '../src/component/layer3-tools.js';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const blueprint = {
    blueprintId: 'login-editorial-' + Date.now(),
    recipeName: 'login',
    analysis: {
        intent: 'Create a high-end editorial style login page',
        tone: 'elegant',
    },
    structure: {
        componentName: 'Card',
        props: {
            padding: 'xlarge',
            className: 'max-w-md mx-auto mt-20 shadow-none border-none bg-transparent',
        },
        slots: {
            content: [
                {
                    componentName: 'Typography',
                    props: {
                        variant: 'h1',
                        text: 'Tekton Studio',
                        className: 'text-center mb-2 font-serif text-4xl',
                    },
                },
                {
                    componentName: 'Typography',
                    props: {
                        variant: 'body1',
                        text: 'Sign in to access your editorial workspace',
                        className: 'text-center text-muted-foreground mb-8',
                    },
                },
                {
                    componentName: 'Stack',
                    props: {
                        className: 'flex flex-col gap-4',
                    },
                    slots: {
                        content: [
                            {
                                componentName: 'Input',
                                props: {
                                    label: 'Email Address',
                                    placeholder: 'name@magazine.com',
                                },
                            },
                            {
                                componentName: 'Input',
                                props: {
                                    label: 'Password',
                                    type: 'password',
                                    placeholder: '••••••••',
                                },
                            },
                            {
                                componentName: 'Button',
                                props: {
                                    variant: 'primary',
                                    text: 'Sign In',
                                    fullWidth: true,
                                    className: 'bg-black text-white hover:bg-gray-800 transition-colors uppercase tracking-widest py-3 mt-4',
                                },
                            },
                        ],
                    },
                },
                {
                    componentName: 'Typography',
                    props: {
                        variant: 'body2',
                        text: 'Forgot your password? Reset it here.',
                        className: 'text-center mt-6 text-sm',
                    },
                },
            ],
        },
    },
};

async function execute() {
    const outputPath = join(__dirname, '../../studio-web/src/app/login/page.tsx');
    console.log('Target path:', outputPath);

    try {
        const result = await renderScreen(blueprint, outputPath);

        if (result.success) {
            console.log('✅ Login page generated successfully!');
            console.log('File:', result.filePath);
        } else {
            console.error('❌ Generation failed:', result.error);
            process.exit(1);
        }
    } catch (err) {
        console.error('❌ Unexpected error during generation:', err);
        process.exit(1);
    }
}

execute().catch(console.error);
