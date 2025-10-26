// Critical CSS for above-the-fold content
export const CriticalCSS = () => (
  <style dangerouslySetInnerHTML={{
    __html: `
      .menu-item{display:flex;align-items:center;gap:0.75rem;padding:0.5rem 0.75rem;border-radius:0.5rem;transition:all 0.2s}
      .menu-item-active{background-color:rgb(239 246 255);color:rgb(59 130 246)}
      .menu-item-inactive{color:rgb(107 114 128)}
      .menu-item-inactive:hover{background-color:rgb(249 250 251);color:rgb(17 24 39)}
      .dark .menu-item-active{background-color:rgb(30 58 138 / 0.3);color:rgb(147 197 253)}
      .dark .menu-item-inactive{color:rgb(209 213 219)}
      .dark .menu-item-inactive:hover{background-color:rgb(55 65 81);color:rgb(243 244 246)}
      .sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
    `
  }} />
);