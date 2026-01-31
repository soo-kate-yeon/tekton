# Strategic Thinking Framework

## When to Activate Deep Analysis

Strategic thinking should be activated for complex decisions that have significant impact on the project.

### Trigger Conditions

- **Architecture decisions** affecting 5+ files
- **Technology selection** between multiple options
- **Performance vs maintainability** trade-offs
- **Breaking changes** consideration
- **Library or framework** selection
- **System design** choices with long-term implications
- **Migration strategies** for legacy systems
- **Scalability planning** for growing applications

**Why Activate**: Deep analysis prevents costly mistakes and ensures optimal decisions for complex scenarios.

---

## Five-Phase Thinking Process

### Phase 1 - Assumption Audit

Surface hidden assumptions using AskUserQuestion.

**Process**:
1. List all assumptions underlying the proposed solution
2. Categorize each assumption:
   - **Technical**: Technology capabilities, performance characteristics
   - **Business**: User needs, market conditions, budget constraints
   - **Team**: Skills, availability, processes
   - **Integration**: Dependencies, external systems, compatibility

3. Validate critical assumptions before proceeding
4. Challenge assumptions with "What if this is wrong?"

**Example Questions**:
- "Are we assuming users have modern browsers?"
- "Are we assuming the API will have 99.9% uptime?"
- "Are we assuming the team knows React well?"
- "Are we assuming the database can handle 10x traffic?"

**Output**: List of validated assumptions and identified risks.

---

### Phase 2 - First Principles Decomposition

Apply Five Whys to identify root causes and distinguish hard constraints from soft preferences.

**Process**:
1. Start with the problem statement
2. Ask "Why?" five times to reach root cause
3. Identify hard constraints (cannot be changed)
4. Identify soft preferences (can be negotiated)

**Example**:
- **Problem**: "We need to implement real-time updates"
- **Why?** "Users want to see changes immediately"
- **Why?** "They're collaborating with teammates"
- **Why?** "They need to avoid conflicting edits"
- **Why?** "Data consistency is critical for this use case"
- **Root Cause**: Prevent data conflicts in collaborative editing

**Output**: Clear understanding of root problem vs symptoms, hard vs soft constraints.

---

### Phase 3 - Alternative Generation

Generate minimum 2-3 distinct approaches with different trade-off profiles.

**Process**:
1. Generate at least 3 alternatives
2. Include different risk/reward profiles:
   - **Conservative**: Low risk, proven approach, may sacrifice some benefits
   - **Balanced**: Moderate risk and reward, well-tested patterns
   - **Aggressive**: Higher risk, potentially higher reward, innovative

**Example Alternatives for Real-Time Updates**:
- **Conservative**: Polling every 5 seconds (simple, proven, higher server load)
- **Balanced**: WebSocket with fallback to polling (standard approach, good balance)
- **Aggressive**: Server-Sent Events with CRDT for offline support (complex, best UX)

**Output**: 3+ distinct alternatives with different characteristics.

---

### Phase 4 - Trade-off Analysis

Apply weighted scoring across criteria: Performance, Maintainability, Cost, Risk, Scalability.

**Process**:
1. Define evaluation criteria and weights
2. Score each alternative (1-10) on each criterion
3. Calculate weighted scores
4. Consider non-quantifiable factors

**Criteria Examples**:
- **Performance** (25%): Response time, throughput, resource usage
- **Maintainability** (20%): Code complexity, debugging ease, documentation
- **Cost** (15%): Development time, infrastructure, operational costs
- **Risk** (20%): Technology maturity, team expertise, failure modes
- **Scalability** (20%): Growth capacity, horizontal scaling, bottlenecks

**Example Scoring**:
```
Alternative A (Polling):
- Performance: 5/10 (frequent polling overhead)
- Maintainability: 9/10 (simple implementation)
- Cost: 6/10 (higher server costs)
- Risk: 9/10 (proven, low risk)
- Scalability: 5/10 (scales poorly with users)
Weighted Score: 6.7/10

Alternative B (WebSocket):
- Performance: 9/10 (efficient real-time)
- Maintainability: 7/10 (moderate complexity)
- Cost: 8/10 (reasonable costs)
- Risk: 7/10 (mature technology)
- Scalability: 8/10 (scales well)
Weighted Score: 7.8/10

Alternative C (SSE + CRDT):
- Performance: 10/10 (optimal efficiency)
- Maintainability: 4/10 (high complexity)
- Cost: 5/10 (high dev time)
- Risk: 4/10 (newer technology)
- Scalability: 10/10 (excellent scaling)
Weighted Score: 6.6/10
```

**Output**: Ranked alternatives with quantitative and qualitative justification.

---

### Phase 5 - Cognitive Bias Check

Verify not anchored to first solution and confirm consideration of contrary evidence.

**Common Biases to Check**:
- **Anchoring Bias**: Are we too attached to the first idea?
- **Confirmation Bias**: Are we only looking for supporting evidence?
- **Availability Bias**: Are we overweighting recent experiences?
- **Sunk Cost Fallacy**: Are we continuing because we've invested time?
- **Status Quo Bias**: Are we favoring current approach without justification?

**Bias Detection Questions**:
- "What evidence contradicts our preferred solution?"
- "What would make us change our mind?"
- "Are we ignoring any alternative because it's unfamiliar?"
- "Have we given equal consideration to all options?"
- "What are we afraid to ask or challenge?"

**Devil's Advocate Exercise**:
- Assign someone to argue against the preferred solution
- List all potential failure modes
- Consider worst-case scenarios
- Identify overlooked risks

**Output**: Validated decision free from major cognitive biases.

---

## Decision Documentation

### Document the Decision

Record the strategic decision for future reference:

**Template**:
```markdown
# Decision: [Title]

## Context
[What problem are we solving? What constraints exist?]

## Assumptions
[Key assumptions and their validation status]

## Alternatives Considered
1. [Alternative A]: [Description]
   - Pros: [Benefits]
   - Cons: [Drawbacks]

2. [Alternative B]: [Description]
   - Pros: [Benefits]
   - Cons: [Drawbacks]

## Decision
[Chosen alternative and rationale]

## Trade-offs
[Accepted trade-offs and mitigation strategies]

## Success Criteria
[How we'll measure if this was the right decision]

## Review Date
[When to re-evaluate this decision]
```

### Share with Stakeholders

Communicate the decision and reasoning to relevant stakeholders:
- Development team
- Product management
- Technical leadership
- Affected users or customers

---

## Practical Examples

### Example 1: Database Selection

**Context**: Choosing database for new microservice handling user sessions.

**Phase 1 - Assumptions**:
- Session data is ephemeral (can be lost without major issues)
- Read-heavy workload (10:1 read-to-write ratio)
- Need sub-10ms latency for reads
- Budget allows for managed service

**Phase 2 - Root Cause**:
- Why database? → Store session state
- Why store state? → Enable multi-server deployment
- Why multi-server? → Handle traffic spikes
- **Root need**: Fast, ephemeral storage with high availability

**Phase 3 - Alternatives**:
- **Conservative**: PostgreSQL with caching layer
- **Balanced**: Redis with persistence
- **Aggressive**: In-memory distributed cache (Hazelcast)

**Phase 4 - Scoring** (Performance 30%, Maintainability 25%, Cost 20%, Risk 15%, Scalability 10%):
- PostgreSQL: 6.5/10 (reliable but slower)
- Redis: 8.2/10 (best balance)
- Hazelcast: 7.1/10 (complex, high performance)

**Phase 5 - Bias Check**:
- Not anchored to PostgreSQL (our usual choice)
- Considered Redis despite less familiarity
- Acknowledged in-memory risks

**Decision**: Redis with AOF persistence
- Best performance for use case
- Team willing to learn
- Acceptable risk for session data

---

### Example 2: Monolith vs Microservices

**Context**: Refactoring growing application approaching 100K lines.

**Phase 1 - Assumptions**:
- Team can handle distributed systems complexity
- Deployment pipeline supports multiple services
- Business needs independent scaling
- Latency between services acceptable

**Phase 2 - Root Cause**:
- Why refactor? → Difficult to deploy and scale
- Why difficult? → Single deployment unit
- Why single unit? → Originally small application
- **Root need**: Independent deployment and scaling of components

**Phase 3 - Alternatives**:
- **Conservative**: Optimize monolith, add horizontal scaling
- **Balanced**: Extract 2-3 critical services, keep core monolith
- **Aggressive**: Full microservices architecture (10+ services)

**Phase 4 - Scoring**:
- Optimized Monolith: 7.0/10 (low risk, limited scaling)
- Hybrid Approach: 8.5/10 (best trade-off)
- Full Microservices: 6.0/10 (high complexity, future-proof)

**Phase 5 - Bias Check**:
- Not following microservices trend blindly
- Acknowledged monolith strengths
- Considered team capacity realistically

**Decision**: Hybrid approach
- Extract high-traffic APIs (3 services)
- Keep core business logic in monolith
- Migrate incrementally over 6 months

---

## Works Well With

**Documentation**:
- [CLAUDE.md](/Users/asleep/Developer/tekton/CLAUDE.md) - Core decision-making framework
- [moai-foundation-core](../../.claude/skills/moai-foundation-core/SKILL.md) - SPEC-first methodology

**Skills**:
- moai-foundation-philosopher - Strategic thinking patterns
- moai-workflow-spec - Requirement analysis

**Agents**:
- core-planner - Strategic planning and decomposition
- manager-strategy - Complex decision-making workflows

**Commands**:
- /moai:1-plan - SPEC creation with strategic analysis

---

**Last Updated**: 2026-01-23
**Status**: Production Ready
**Source**: Extracted from CLAUDE.md for improved maintainability
