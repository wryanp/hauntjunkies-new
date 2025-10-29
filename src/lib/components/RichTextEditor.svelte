<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Editor } from 'svelte-tiptap';
	import StarterKit from '@tiptap/starter-kit';
	import Link from '@tiptap/extension-link';
	import Image from '@tiptap/extension-image';

	let { value = $bindable(''), placeholder = '' } = $props();

	let editor: any;
	let editorElement: HTMLDivElement;

	// Convert plain text with newlines to HTML paragraphs
	function textToHtml(text: string): string {
		if (!text) return '';

		console.log('[RichTextEditor] Original text:', text.substring(0, 200));
		console.log('[RichTextEditor] Has newlines:', text.includes('\n'));
		console.log('[RichTextEditor] Has HTML tags:', /<[a-z][\s\S]*>/i.test(text));

		// If already HTML (contains p tags specifically), return as is
		if (/<p[\s>]/i.test(text)) {
			console.log('[RichTextEditor] Detected HTML paragraphs, returning as-is');
			return text;
		}

		// Check if there are any newlines at all
		if (!text.includes('\n')) {
			// No newlines - just wrap the entire text in one paragraph
			console.log('[RichTextEditor] No newlines detected, wrapping in single paragraph');
			return `<p>${text}</p>`;
		}

		// Convert plain text: Split by newlines but group into paragraphs
		// A blank line (double newline) creates a new paragraph
		// Single newlines within a paragraph become <br> tags
		const paragraphs = text
			.split(/\n\s*\n/) // Split by double newlines (blank lines)
			.map(para => para.trim())
			.filter(para => para.length > 0);

		console.log('[RichTextEditor] Split into', paragraphs.length, 'paragraphs');

		// For each paragraph, replace single newlines with <br>
		const html = paragraphs
			.map(para => {
				const content = para.replace(/\n/g, '<br>');
				return `<p>${content}</p>`;
			})
			.join('');

		return html;
	}

	onMount(() => {
		if (editorElement) {
			editor = new Editor({
				element: editorElement,
				extensions: [
					StarterKit.configure({
						heading: {
							levels: [1, 2, 3, 4, 5, 6]
						}
					}),
					Link.configure({
						openOnClick: false,
						HTMLAttributes: {
							class: 'text-haunt-orange hover:underline'
						}
					}),
					Image.configure({
						inline: true,
						HTMLAttributes: {
							class: 'max-w-full h-auto rounded-lg'
						}
					})
				],
				content: textToHtml(value),
				editorProps: {
					attributes: {
						class: 'prose prose-invert max-w-none focus:outline-none min-h-[400px] p-4'
					}
				},
				onUpdate: ({ editor }) => {
					value = editor.getHTML();
				}
			});
		}
	});

	onDestroy(() => {
		editor?.destroy();
	});

	// Toolbar action functions
	function toggleBold() {
		editor?.chain().focus().toggleBold().run();
	}

	function toggleItalic() {
		editor?.chain().focus().toggleItalic().run();
	}

	function toggleStrike() {
		editor?.chain().focus().toggleStrike().run();
	}

	function toggleBulletList() {
		editor?.chain().focus().toggleBulletList().run();
	}

	function toggleOrderedList() {
		editor?.chain().focus().toggleOrderedList().run();
	}

	function setHeading(level: 1 | 2 | 3 | 4 | 5 | 6) {
		editor?.chain().focus().toggleHeading({ level }).run();
	}

	function setParagraph() {
		editor?.chain().focus().setParagraph().run();
	}

	function addLink() {
		const url = prompt('Enter URL:');
		if (url) {
			editor?.chain().focus().setLink({ href: url }).run();
		}
	}

	function removeLink() {
		editor?.chain().focus().unsetLink().run();
	}

	function addImage() {
		const url = prompt('Enter image URL:');
		if (url) {
			editor?.chain().focus().setImage({ src: url }).run();
		}
	}

	function undo() {
		editor?.chain().focus().undo().run();
	}

	function redo() {
		editor?.chain().focus().redo().run();
	}
</script>

<div class="rich-text-editor">
	<!-- Toolbar -->
	<div class="toolbar">
		<div class="toolbar-group">
			<button type="button" onclick={undo} title="Undo" class="toolbar-btn">
				<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
				</svg>
			</button>
			<button type="button" onclick={redo} title="Redo" class="toolbar-btn">
				<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
				</svg>
			</button>
		</div>

		<div class="toolbar-divider"></div>

		<div class="toolbar-group">
			<select onchange={(e) => {
				const value = (e.target as HTMLSelectElement).value;
				if (value === 'p') setParagraph();
				else setHeading(parseInt(value) as 1 | 2 | 3 | 4 | 5 | 6);
			}} class="toolbar-select">
				<option value="p">Paragraph</option>
				<option value="1">Heading 1</option>
				<option value="2">Heading 2</option>
				<option value="3">Heading 3</option>
				<option value="4">Heading 4</option>
				<option value="5">Heading 5</option>
				<option value="6">Heading 6</option>
			</select>
		</div>

		<div class="toolbar-divider"></div>

		<div class="toolbar-group">
			<button type="button" onclick={toggleBold} title="Bold" class="toolbar-btn font-bold">
				B
			</button>
			<button type="button" onclick={toggleItalic} title="Italic" class="toolbar-btn italic">
				I
			</button>
			<button type="button" onclick={toggleStrike} title="Strikethrough" class="toolbar-btn line-through">
				S
			</button>
		</div>

		<div class="toolbar-divider"></div>

		<div class="toolbar-group">
			<button type="button" onclick={toggleBulletList} title="Bullet List" class="toolbar-btn">
				<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
				</svg>
			</button>
			<button type="button" onclick={toggleOrderedList} title="Numbered List" class="toolbar-btn">
				<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5h12M9 12h12M9 19h12M5 5v.01M5 12v.01M5 19v.01" />
				</svg>
			</button>
		</div>

		<div class="toolbar-divider"></div>

		<div class="toolbar-group">
			<button type="button" onclick={addLink} title="Add Link" class="toolbar-btn">
				<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
				</svg>
			</button>
			<button type="button" onclick={removeLink} title="Remove Link" class="toolbar-btn">
				<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>
			<button type="button" onclick={addImage} title="Add Image" class="toolbar-btn">
				<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
				</svg>
			</button>
		</div>
	</div>

	<!-- Editor Content -->
	<div bind:this={editorElement} class="editor-content" data-placeholder={placeholder}></div>
</div>

<style>
	.rich-text-editor {
		border: 2px solid rgba(252, 116, 3, 0.3);
		border-radius: 0.5rem;
		background-color: rgba(0, 0, 0, 0.5);
		overflow: hidden;
	}

	.rich-text-editor:hover {
		border-color: rgba(252, 116, 3, 0.5);
	}

	.toolbar {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem;
		background-color: rgba(0, 0, 0, 0.3);
		border-bottom: 1px solid rgba(252, 116, 3, 0.2);
		flex-wrap: wrap;
	}

	.toolbar-group {
		display: flex;
		gap: 0.25rem;
	}

	.toolbar-divider {
		width: 1px;
		height: 1.5rem;
		background-color: rgba(156, 163, 175, 0.3);
	}

	.toolbar-btn {
		padding: 0.375rem 0.5rem;
		border-radius: 0.25rem;
		background-color: transparent;
		color: #d1d5db;
		border: 1px solid transparent;
		cursor: pointer;
		transition: all 0.15s;
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 2rem;
	}

	.toolbar-btn:hover {
		background-color: rgba(252, 116, 3, 0.2);
		border-color: rgba(252, 116, 3, 0.3);
		color: #fc7403;
	}

	.toolbar-select {
		padding: 0.375rem 0.5rem;
		border-radius: 0.25rem;
		background-color: rgba(0, 0, 0, 0.3);
		color: #d1d5db;
		border: 1px solid rgba(252, 116, 3, 0.3);
		cursor: pointer;
		font-size: 0.875rem;
	}

	.toolbar-select:hover {
		border-color: rgba(252, 116, 3, 0.5);
	}

	:global(.editor-content) {
		min-height: 400px;
		max-height: 600px;
		overflow-y: auto;
		color: #fff;
		background-color: rgba(26, 26, 26, 0.5);
	}

	:global(.editor-content[data-placeholder]:empty:before) {
		content: attr(data-placeholder);
		color: #6b7280;
		pointer-events: none;
		position: absolute;
		padding: 1rem;
	}

	:global(.editor-content .ProseMirror) {
		outline: none;
	}

	:global(.editor-content p) {
		margin: 0.5em 0;
	}

	:global(.editor-content h1) {
		font-size: 2em;
		font-weight: bold;
		margin: 0.67em 0;
	}

	:global(.editor-content h2) {
		font-size: 1.5em;
		font-weight: bold;
		margin: 0.75em 0;
	}

	:global(.editor-content h3) {
		font-size: 1.17em;
		font-weight: bold;
		margin: 0.83em 0;
	}

	:global(.editor-content ul, .editor-content ol) {
		padding-left: 1.5rem;
		margin: 0.5em 0;
	}

	:global(.editor-content strong) {
		font-weight: bold;
	}

	:global(.editor-content em) {
		font-style: italic;
	}

	:global(.editor-content a) {
		color: #fc7403;
		text-decoration: underline;
	}

	:global(.editor-content img) {
		max-width: 100%;
		height: auto;
		border-radius: 0.5rem;
	}
</style>
