import { prefersReducedMotion } from "../state";
import { secureRandom } from "../utils";

export function initFloatingTags() {
  const hero = document.querySelector<HTMLElement>(".hero");
  if (!hero) return;
  // decorativo e só faz sentido em movimento: parado, ficaria sobre o texto do hero
  if (prefersReducedMotion) return;
  const random = (max = 1) => secureRandom() * max;
  const tags = [
    "JSON",
    "OAuth 2.0",
    "WebSocket",
    "HTTPS",
    "CORS",
    "HTTP",
    "GraphQL",
    "API Gateway",
    "Microservices",
    "Monolith",
    "MVC",
    "SOLID",
    "OOP",
    "Design Patterns",
    "Clean Architecture",
    "Event-Driven",
    "Scalability",
    "useState()",
    "useEffect()",
    "async/await",
    "SQL",
    "NoSQL",
    "CI/CD",
    "git init",
    "git clone",
    "git add",
    "git commit",
    "git push",
    "git pull",
    "git merge",
    "git branch",
    "git checkout",
    "npm install",
    "npm run dev",
    "npx",
    "pip install",
    "$ sudo",
    "docker build",
    "docker compose",
    "curl",
    "<div>",
    "</div>",
    "function(){}",
    "const app",
    "import React",
    "export default",
    "console.log()",
    "try/catch",
    "async/await",
    "=> {}",
    "AI",
    "LLM",
    "Prompt Engineering",
    "IoT",
    "Data Analytics",
    "Smart Contracts",
    "200 OK",
    "201 Created",
    "400 Bad Request",
    "401 Unauthorized",
    "403 Forbidden",
    "404 Not Found",
    "500 Server Error",
  ];
  const container = document.createElement("div");
  container.className = "floating-tags-container";
  container.setAttribute("aria-hidden", "true"); // decorativo
  hero.appendChild(container);

  tags.forEach((tag) => {
    const el = document.createElement("span");
    el.className = "floating-tag";
    el.textContent = tag;
    el.style.cssText = `
      left:${random(95)}%;
      top:${random(90)}%;
      animation-delay:${random(8)}s;
      animation-duration:${12 + random(10)}s;
      font-size:${0.6 + random(0.4)}rem;
      opacity:${0.08 + random(0.12)};
    `;
    container.appendChild(el);
  });
}
