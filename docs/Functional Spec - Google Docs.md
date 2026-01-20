# **Functional Specification: AI-Native Component Knowledge System**

Version: 1.0.0  
Context: AI-Driven UI Generation via Slot Assembly & MCP Architecture  
Target Audience: System Architects, AI Engineers, Frontend Developers

## **1\. Executive Summary**

본 문서는 Figma 등의 디자인 도구 없이, 개발자의 \*\*의도(Intent)\*\*와 **Web Studio의 설정**만으로 고품질의 UI 코드를 생성하는 **AI-Native Design System**의 기능 명세를 정의한다.

이 시스템은 **"Slot Assembly (슬롯 조립)"** 모델을 기반으로 하며, \*\*MCP (Model Context Protocol)\*\*를 통해 정적인 설정 데이터를 동적인 \*\*AI 지식(Context)\*\*으로 변환하여 코딩 에이전트에게 실시간으로 주입하는 것을 핵심으로 한다.

## **2\. System Architecture & Data Flow**

시스템은 데이터의 흐름과 역할에 따라 3계층(Layer)으로 구성된다.

### **Layer 1: Configuration (Source of Truth)**

* **Platform:** Web Studio (SaaS)  
* **Role:** 디자인 시스템의 설정 및 데이터 관리 (SSOT).  
* **Data Types:**  
  * **Recipes:** UI 템플릿 (Layout structure).  
  * **Tokens:** 디자인 토큰 (Colors, Typography).  
  * **Components:** 표준 컴포넌트 및 사용자 정의(Custom) 컴포넌트 메타데이터.  
* **Output:** design-system.config.json (Raw JSON).

### **Layer 2: Knowledge Translation (The Brain)**

* **Platform:** MCP Server (Standalone or Hosted)  
* **Role:** Raw Data를 AI가 이해 가능한 "지식"과 "규칙"으로 변환 및 서빙.  
* **Key Functions:**  
  * JSON → Markdown/TypeScript Definition 변환 (Context Injection).  
  * **Component Capability Catalog** 제공.  
  * Blueprint 유효성 검사 (Validation Tool).  
* **Protocol:** mcp://design-system

### **Layer 3: Execution (The Hand)**

* **Platform:** Coding Agent (IDE, CLI, Cursor)  
* **Role:** 실제 코드 생성.  
* **Process:**  
  1. 사용자 프롬프트 수신.  
  2. MCP를 통해 현재 프로젝트의 컴포넌트 지식 로드.  
  3. Blueprint JSON 생성 (Logical Structure).  
  4. 최종 Frontend Code (React/Vue 등) 생성.

## **3\. Core Logic: Component Knowledge System**

AI가 화면을 조립하기 위한 3단계 지식 계층 구조 정의.

### **3.1. Module A: Slot Semantic Registry**

화면의 구획(Slot)을 정의하고 각 구획의 역할과 위계를 지정한다.

* **Global Slots:** Header, Sidebar, Main, Footer (Layout Level).  
* **Local Slots:** Card\_Actions, Table\_Toolbar (Component Level).  
* **Properties:**  
  * role: 의미론적 역할 (e.g., navigation, primary-content).  
  * constraintTags: 허용된 컴포넌트 범주 (e.g., Main 슬롯은 Container 급 이상만 허용).

### **3.2. Module B: Component Capability Catalog (Metadata)**

AI가 컴포넌트의 용도를 추론하기 위한 확장 메타데이터 스키마.

interface ComponentKnowledge {  
  name: string; // e.g., "UserTable"  
  type: "atom" | "molecule" | "organism" | "template"; // Component Hierarchy  
  category: "display" | "input" | "action" | "container" | "navigation";  
    
  // Semantic Scoring Criteria  
  slotAffinity: {  
    \[slotName: string\]: number; // 0.0 \~ 1.0 (e.g., { main: 0.9, sidebar: 0.1 })  
  };

  // Contextual Guide for AI  
  semanticDescription: {  
    purpose: string; // e.g., "Used for visualizing high-density data sets."  
    visualImpact: "subtle" | "neutral" | "prominent";  
    complexity: "low" | "medium" | "high";  
  };

  // Rules & Constraints  
  constraints: {  
    requires?: string\[\]; // Mandatory Parent/Child  
    conflictsWith?: string\[\]; // Cannot be used with...  
    excludedSlots?: string\[\]; // Explicitly forbidden slots  
  };  
}

### **3.3. Module C: Blueprint Recipe System**

UI 패턴 템플릿과 동적 조립 규칙.

* **Logic:**  
  * **Intent-Based Injection:** 사용자가 "Read-Only" 요청 시 Action(Modification) 카테고리 컴포넌트 점수 하향 조정.  
  * **Fluid Fallback:** 적합한 컴포넌트 부재 시 Placeholder 자동 할당.

## **4\. Operational Workflow (Example)**

**Scenario:** 사용자가 *"커스텀 차트(SuperChart)가 포함된 관리자 대시보드"* 생성을 요청.

### **Step 1: Definition (Web Studio)**

* 사용자가 SuperChart 정의: "이 차트는 사이드바에 넣지 마(Exclude Sidebar)."  
* **Stored JSON:** {"name": "SuperChart", "constraints": {"excludedSlots": \["sidebar"\]}}

### **Step 2: Context Injection (MCP)**

* Agent가 design://knowledge/components 리소스 요청.  
* MCP가 JSON을 파싱하여 **Markdown** 형태로 변환 제공:  
  ...  
  Component: SuperChart  
  * **Type:** Organism  
  * **Constraint:** ⛔ NEVER place in sidebar.  
  * Best For: Main content area.  
    ...

### **Step 3: Reasoning (Agent)**

* **Intent:** "Dashboard" → DashboardLayout 레시피 로드.  
* **Slot Filling:**  
  * Sidebar 슬롯: SuperChart 시도 → **Constraint 위반 감지** → NavList로 대체.  
  * Main 슬롯: SuperChart 적합도(Affinity) 높음 → 배치 확정.

### **Step 4: Generation (Output)**

* 검증된 Blueprint JSON을 기반으로 Dashboard.tsx 코드 생성.

## **5\. Algorithms & Logic**

### **5.1. Semantic Scoring Algorithm**

AI가 최적의 컴포넌트를 선정하는 가중치 산출 공식.

$$ Score \= (BaseAffinity \\times 0.5) \+ (IntentMatch \\times 0.3) \+ (ContextPenalty \\times 0.2) $$

* **BaseAffinity:** 메타데이터상의 기본 적합도.  
* **IntentMatch:** 사용자 프롬프트(예: "Data-heavy")와 컴포넌트 특성 일치도.  
* **ContextPenalty:** 제약 조건(크기, 테마 등) 위반 시 감점.

### **5.2. Safety Protocols**

* **Threshold Check:** 최종 점수가 0.4 미만인 경우 해당 컴포넌트 사용을 보류하고 GenericContainer 사용.  
* **Hallucination Check:** validate\_blueprint 툴을 통해 생성된 JSON의 컴포넌트가 실제 라이브러리에 존재하는지 검증.

## **6\. Implementation Notes for Agents**

이 명세를 구현하는 에이전트는 다음 지침을 준수해야 한다.

1. **State Statelessness:** MCP 서버는 상태를 저장하지 않고, 요청 시점의 DB 데이터를 기준으로 지식을 생성해야 한다.  
2. **Prompt Engineering:** 생성된 Markdown 지식은 에이전트의 System Prompt 또는 User Message의 최상단에 주입되어야 한다.  
3. **Strict Typing:** Blueprint JSON 생성 시 ComponentKnowledge 인터페이스를 엄격히 준수하도록 강제해야 한다.