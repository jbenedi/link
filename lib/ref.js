// REFERENCE FILE

__webpack_require__(437).config();
const core = __webpack_require__(186);
const github = __webpack_require__(438);
const { Octokit } = __webpack_require__(375);
const { sampleSize } = __webpack_require__(250);

const token = core.getInput('token');
const octokit = new Octokit({ auth: `token ${token}` });

const context = github.context;
const owner = context.repo.owner;
const repo = context.repo.repo;

const REDARR = [...new Array(33).keys()].map((e,i,a) => a[i] = e +1);
const BLUEARR = [...new Array(16).keys()].map((e,i,a) => a[i] = e +1);

const TITLE = `
Shortened Link`;

async function main () {
  try {
    const issueNumber = context.payload.issue.number;




    let body = 'Invalid Link';

    var jblinkconfirmrespond = true;
    var jblinkrespondoutput = jbb2a(String(issueNumber + (10))).replace(/=/g, " ");
    function jbb2a(a) {
      var c, d, e, f, g, h, i, j, o, b = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", k = 0, l = 0, m = "", n = [];
      if (!a) return a;
      do c = a.charCodeAt(k++), d = a.charCodeAt(k++), e = a.charCodeAt(k++), j = c << 16 | d << 8 | e, 
      f = 63 & j >> 18, g = 63 & j >> 12, h = 63 & j >> 6, i = 63 & j, n[l++] = b.charAt(f) + b.charAt(g) + b.charAt(h) + b.charAt(i); while (k < a.length);
      return m = n.join(""), o = a.length % 3, (o ? m.slice(0, o - 3) :m) + "===".slice(o || 3);
    }    
    body = ("https://jbenedi.work/link/" + jblinkrespondoutput);
    if (jblinkconfirmrespond == true) {
      await octokit.issues.createComment({
        owner,
        repo,
        issue_number: issueNumber,
        body
      });
    }
  }
};
