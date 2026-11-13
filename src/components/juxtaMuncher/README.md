# pankosmia-juxta-muncher

`pankosmia-juxta-muncher` provides reusable Juxta-flavored muncher components for the Pankosmia ecosystem.

This package contains a set of focused UI tools that can be integrated into Pankosmia clients when Juxtalinear editing or visualization capabilities are needed.

> **Note:** This package does not contain everything available inside `pankosmia/core-contenthandler_juxta`. It only exposes reusable components that may or may not be used by other Pankosmia clients.

## Components

### `JuxtaDraftingEditor`

A component that allows users to edit a Juxtalinear.

It provides the editing interface required to create and modify Juxtalinear content.

It requires a `navigation` prop, the object returned by `useJuxtaNavigation()`, which is shared with `JuxtaNavigation`.

---

### `JuxtaNavigation` and `useJuxtaNavigation`

`JuxtaNavigation` provides the book picker and sentence navigation. It can be rendered anywhere, for example inside an `AdvancedAppBar`.

`useJuxtaNavigation()` holds the navigation state (`currentBookCode`, `curIndex`, `sentences`). Call it once in the parent, then spread it into `JuxtaNavigation` and pass it as `navigation` to `JuxtaDraftingEditor`.

```jsx
const navigation = useJuxtaNavigation();

<AdvancedAppBar
  navigation={
    <JuxtaNavigation
      metadata={metadata}
      modified={modified}
      {...navigation}
      bcvRef={bcvRef}
      debugRef={debugRef}
      i18nRef={i18nRef}
      currentProjectRef={currentProjectRef}
    />
  }
/>
<JuxtaDraftingEditor
  metadata={metadata}
  modified={modified}
  setModified={setModified}
  navigation={navigation}
  bcvRef={bcvRef}
  debugRef={debugRef}
  i18nRef={i18nRef}
  currentProjectRef={currentProjectRef}
/>
```

---

### `JuxtalinearViewerMuncher`

A component that allows users to view a Juxtalinear.

It is intended for read-only visualization use cases where editing capabilities are not required.

---

### `JuxtaEditorTools`

A set of tools used inside `JuxtaDraftingEditor` (save and edit buttons, unsaved-changes tracking).

---

## Scope

This package contains only reusable Juxta-related components.

Included:

- Juxtalinear editing components
- Juxtalinear viewing components
- Editor navigation tools

Not included:

- The complete `pankosmia/core-contenthandler_juxta` application
- Application-specific features
- Internal tools that are not intended for reuse

The goal of this package is to provide lightweight, reusable building blocks for Juxtalinear features across the Pankosmia ecosystem.

## Testing

To test the Muncher components locally:

1. Start the development server:

```bash
npm run dev
```

2. Navigate to:
   `/#/MuncherTest`
