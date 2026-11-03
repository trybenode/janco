"use client";
/*
 * JANCO FILE DOCUMENTATION
 * Purpose: Configures or provides global error functionality for the customer and janitor PWA.
 * Why: It groups this functionality for reuse or execution within the project.
 * Uses or links to: None identified by static analysis; framework, runtime, or external consumers may exist.
 * Imported or linked from: None identified by static analysis; framework, runtime, or external consumers may exist.
 * Entry point: Framework-discovered Next.js entry point.
 */


export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <html lang="en-NG"><body style={{margin:0,fontFamily:"Arial,sans-serif",background:"#f0f4c3",color:"#212121"}}><main style={{maxWidth:430,margin:"0 auto",padding:32}}><section style={{background:"#f7f8f2",borderRadius:12,padding:24}}><p style={{color:"#757575"}}>JANCO</p><h1>Something went wrong.</h1><p>We could not load this screen. Try again or return to your saved workspace.</p><button onClick={() => reset()} style={{minHeight:48,border:0,borderRadius:12,padding:"0 20px",background:"#cddc39",color:"#212121",fontWeight:700}}>Try again</button></section></main></body></html>;
}
