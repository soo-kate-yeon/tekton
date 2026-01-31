# Web Search Guidelines

## Anti-Hallucination Policy

### Core Principles

**[HARD] URL Verification Mandate**: All URLs must be verified before inclusion in responses.

**WHY**: Prevents dissemination of non-existent or incorrect information.

**[HARD] Uncertainty Disclosure**: Unverified information must be clearly marked as uncertain.

**WHY**: Maintains transparency and user trust when information cannot be verified.

**[HARD] Source Attribution**: All web search results must include actual search sources.

**WHY**: Enables users to verify information and assess credibility.

---

## Web Search Execution Protocol

### Mandatory Verification Steps

#### 1. Initial Search Phase

Use WebSearch tool with specific, targeted queries. Never fabricate URLs.

**Good Queries**:
- "FastAPI JWT authentication official documentation 2026"
- "PostgreSQL connection pooling best practices"
- "React 18 concurrent rendering guide"
- "Kubernetes deployment strategies comparison"

**Bad Queries**:
- "authentication" (too broad)
- "how to code" (vague)
- Generic terms without context

**Best Practices**:
- Include technology version numbers
- Add year for recent information
- Use specific technical terms
- Combine technology with specific feature

**Example**:
```
Query: "Next.js 14 server actions authentication 2026"

Results:
1. https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions
2. https://nextjs.org/blog/next-14
3. https://github.com/vercel/next.js/discussions/...
```

---

#### 2. URL Validation Phase

Use WebFetch tool to verify each URL before inclusion.

**Validation Process**:
1. Execute WebFetch on discovered URL
2. Verify content actually exists
3. Confirm content relevance to query
4. Extract key information
5. Include verified URL in response

**Example**:
```
# Step 1: Search
WebSearch("FastAPI authentication tutorial")

# Step 2: Validate found URLs
WebFetch("https://fastapi.tiangolo.com/tutorial/security/")
→ Content exists and relevant ✓

WebFetch("https://example.com/fastapi-auth")
→ 404 Not Found ✗ (exclude from response)
```

**Never**:
- Include URLs without fetching them
- Assume URL exists based on pattern
- Fabricate URLs that "should exist"

---

#### 3. Response Construction Phase

Only include verified URLs with actual search sources.

**Required Elements**:
- Verified, working URLs only
- Brief description of each source
- Relevance to user's question
- Publication date or last update (if available)

**Response Template**:
```markdown
Based on recent documentation and resources:

[Your answer with verified information]

**Sources**:
1. [Official Documentation Title] - https://verified-url.com
   Last updated: [Date]

2. [Tutorial/Guide Title] - https://another-verified-url.com
   Published: [Date]

3. [Community Resource Title] - https://third-verified-url.com
   Community discussion from [Date]
```

**Example Response**:
```markdown
FastAPI provides built-in security utilities for JWT authentication through the `fastapi.security` module. You can implement JWT authentication using the `OAuth2PasswordBearer` dependency and `jose` library for token handling.

**Sources**:
1. FastAPI Security Tutorial - https://fastapi.tiangolo.com/tutorial/security/
   Official documentation, last updated January 2026

2. JWT Authentication with FastAPI - https://fastapi.tiangolo.com/tutorial/security/oauth2-jwt/
   Official guide for OAuth2 with JWT tokens

3. FastAPI Security Utilities - https://fastapi.tiangolo.com/reference/security/
   API reference for security dependencies
```

---

## Prohibited Practices

### Never Generate Fabricated URLs

**Wrong**:
```
"You can find more information at https://docs.fastapi.com/auth/jwt"
(URL not verified, may not exist)
```

**Right**:
```
# First: WebSearch to find actual URLs
# Second: WebFetch to verify
# Third: Include only verified URLs

"Based on the official FastAPI documentation at https://fastapi.tiangolo.com/tutorial/security/, you can..."
```

---

### Never Present Unverified Information as Fact

**Wrong**:
```
"FastAPI 2.0 was released in January 2026 with revolutionary new features."
(Unverified claim presented as fact)
```

**Right**:
```
"Based on available information as of January 2026, FastAPI is at version 0.109. I don't have verified information about a 2.0 release. Let me search for the latest version."

[Performs WebSearch to verify]
```

---

### Never Omit "Sources:" Section When WebSearch Was Used

**Wrong**:
```
"FastAPI supports JWT authentication through built-in security utilities."
(Used WebSearch but didn't attribute sources)
```

**Right**:
```
"FastAPI supports JWT authentication through built-in security utilities."

**Sources**:
1. FastAPI Security Tutorial - https://fastapi.tiangolo.com/tutorial/security/
```

---

## Handling Uncertainty

### When Information Cannot Be Verified

If WebSearch or WebFetch fails to find or verify information:

**Template**:
```markdown
I attempted to search for [topic] but could not find verified information about [specific claim].

What I can confirm:
- [Verified fact 1]
- [Verified fact 2]

What I cannot verify:
- [Uncertain information]

Would you like me to:
1. Search with different terms
2. Provide information on related topics
3. Suggest alternative approaches
```

**Example**:
```markdown
I searched for information about FastAPI 2.0 release but could not find official announcements.

What I can confirm:
- FastAPI's latest stable version is 0.109.0 as of January 2026
- The project is actively maintained on GitHub

What I cannot verify:
- Plans or timeline for a 2.0 release

Would you like me to:
1. Check the FastAPI GitHub repository for roadmap information
2. Provide information about features in the current stable version
3. Suggest alternative frameworks with similar features
```

---

## Quality Assessment

### Evaluating Source Credibility

Rank sources by credibility:

**Tier 1 - Authoritative** (Highest Priority):
- Official documentation
- Official GitHub repositories
- Official blog posts from maintainers
- Published academic papers

**Tier 2 - Reliable** (High Priority):
- Well-maintained community resources
- Recognized expert blog posts
- Stack Overflow answers with high votes
- Established tutorial sites

**Tier 3 - Community** (Use with Caution):
- Personal blogs (verify against official docs)
- Forum discussions
- Social media posts
- Unverified tutorials

**Tier 4 - Questionable** (Avoid):
- Unmaintained content
- Contradicts official documentation
- No publication date or author
- Low-quality or spam sites

---

### Assessing Information Recency

Prioritize recent information for fast-moving technologies:

**Technology Age Guidelines**:
- **< 2 years old**: Highly dynamic (frameworks, libraries)
  - Prefer sources from last 6-12 months
  - Be cautious with older information

- **2-5 years old**: Moderately stable (established tools)
  - Sources from last 1-2 years acceptable
  - Verify major version compatibility

- **5+ years old**: Mature/stable (core technologies)
  - Older sources generally reliable
  - Check for recent updates on core concepts

**Example**:
```
React 18 (released 2022): Prioritize 2023-2026 sources
PostgreSQL 15 (released 2022): 2020-2026 sources acceptable
HTTP protocol: Older sources reliable (core stable)
```

---

## Practical Workflows

### Research Workflow

1. **Understand Request**:
   - Identify specific question
   - Determine required information type
   - Assess urgency and depth needed

2. **Execute Search**:
   - Formulate specific search query
   - Use WebSearch tool
   - Review returned URLs

3. **Validate Results**:
   - WebFetch each promising URL
   - Verify content relevance
   - Extract key information
   - Assess source credibility

4. **Synthesize Response**:
   - Combine verified information
   - Cite all sources
   - Indicate confidence level
   - Offer follow-up options

---

### Comparison Workflow

When comparing technologies or approaches:

1. **Search for Official Documentation**:
   - Find official docs for each option
   - Verify current versions and features

2. **Search for Comparisons**:
   - Look for authoritative comparison articles
   - Find benchmark studies if relevant

3. **Validate Claims**:
   - Cross-reference comparison claims with official docs
   - Verify performance claims with benchmarks
   - Check recency of comparison

4. **Present Balanced View**:
   - Include verified pros/cons for each
   - Cite multiple perspectives
   - Acknowledge trade-offs
   - Provide source attribution

---

## Error Handling

### WebSearch Failures

**Scenario**: WebSearch tool returns no results or errors.

**Response**:
```markdown
I attempted to search for [topic] but encountered an issue with the search.

Instead, I can:
1. Try searching with alternative terms
2. Provide information based on my training data (with uncertainty disclosure)
3. Suggest related topics I can help with

Which would you prefer?
```

---

### WebFetch Failures

**Scenario**: WebFetch cannot retrieve URL found by WebSearch.

**Response**:
```markdown
I found a potentially relevant resource at [URL], but I cannot access it to verify the content.

I recommend:
1. Visiting the URL directly to verify
2. Letting me search for alternative sources
3. Proceeding with caution if using unverified information

Would you like me to search for alternative verified sources?
```

---

### Conflicting Information

**Scenario**: Multiple sources provide conflicting information.

**Response**:
```markdown
I found conflicting information about [topic]:

**Source A** (Official Documentation):
- [Claim from authoritative source]
- https://verified-url-a.com

**Source B** (Community Resource):
- [Conflicting claim]
- https://verified-url-b.com

The official documentation is more likely to be accurate. I recommend:
1. Prioritizing the official source
2. Verifying the specific use case
3. Checking for version differences

**Sources**:
[List all sources with credibility assessment]
```

---

## Works Well With

**Skills**:
- moai-workflow-jit-docs - Just-in-time documentation loading
- moai-foundation-core - Research and validation workflows

**Tools**:
- WebSearch - Initial information discovery
- WebFetch - URL content verification and retrieval
- Context7 MCP - Official library documentation access

**Documentation**:
- [CLAUDE.md](/Users/asleep/Developer/tekton/CLAUDE.md) - Core execution guidelines

---

**Last Updated**: 2026-01-23
**Status**: Production Ready
**Source**: Extracted from CLAUDE.md for improved maintainability
**Critical Rule**: Never fabricate or include unverified URLs in responses
