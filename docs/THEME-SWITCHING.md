# 🎨 Theme Switching Feature

## Overview

The website supports dynamic theme switching for the contact page, allowing it to match the McCloud Manor branding when needed.

## Usage

### McCloud Manor Theme

To display the contact page with McCloud Manor theming (red accents), use the following URL:

```
/contact?theme=mccloud
```

### Default Theme

The standard contact page uses the default Haunt Junkies theme (orange accents):

```
/contact
```

## Implementation Details

### Navigation Logic

The Navigation component (`src/lib/components/Navigation.svelte`) detects the theme parameter and adjusts accordingly:

- **Logo**: Switches to McCloud Manor logo when `?theme=mccloud` is present
- **Colors**: Uses red (`haunt-red`) instead of orange (`haunt-orange`)
- **Link Behavior**: Preserves the theme when navigating to contact page

### Affected Components

| Component | Behavior |
|-----------|----------|
| **Navigation.svelte** | Switches logo and color scheme based on theme |
| **Contact Page** | Accepts `?theme=mccloud` parameter |
| **Footer** | Maintains consistent branding |

### Code Example

```typescript
// From Navigation.svelte
const isMcCloudContact = $derived(
  $page.url.pathname === '/contact' &&
  $page.url.searchParams.get('theme') === 'mccloud'
);

const logoSrc = $derived(
  (isHauntPage || isMcCloudContact)
    ? '/mccloudmanor.png'
    : '/logo-url.png'
);
```

## Use Cases

1. **Contextual Linking**: Link from McCloud Manor pages to contact with matching branding
2. **Direct Access**: Users can bookmark `/contact?theme=mccloud` for consistent McCloud Manor experience
3. **Marketing**: Separate contact forms for different properties/brands

## Future Enhancements

Potential improvements to the theme system:

- [ ] Add more theme variants (e.g., `?theme=merch`, `?theme=reviews`)
- [ ] Persist theme choice in localStorage
- [ ] Create theme selector UI component
- [ ] Extend theming to other pages

---

*Last Updated: October 26, 2025*
