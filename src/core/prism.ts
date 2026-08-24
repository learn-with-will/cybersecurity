// Prism core + the languages the Cybersecurity lessons use. `bash` is the
// primary language — recon, OpenSSL, hardening, and tooling all run at the
// shell. `python` covers scripting and crypto examples; `javascript` covers
// web-security (XSS, tokens); `sql` covers injection; `http` covers requests,
// responses, and security headers; `json` covers configs, JWTs, and policy
// documents. Plain `text` fences (console output, ASCII diagrams, log lines)
// are left unhighlighted. `javascript` ships with Prism core; the rest are
// added explicitly.
import Prism from 'prismjs';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-http';
import 'prismjs/themes/prism-tomorrow.css';

export default Prism;
