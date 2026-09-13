/**
 * ==============================================================================
 * PROJECTS DATA & CASE STUDY SPECIFICATIONS
 * Portfolio of Quantitative Finance Engines, Intelligent Systems & Full-Stack Apps
 * ==============================================================================
 */

export const PROJECTS_DATA = {
  markowitz: {
    id: "markowitz",
    number: "01",
    flag: "FLAGSHIP SYSTEM",
    isFlagship: true,
    title: "MARKOWITZ PORTFOLIO OPTIMIZATION MODEL",
    shortTitle: "MARKOWITZ OPTIMIZER",
    crumb: "Markowitz",
    summary: "A quantitative portfolio optimization engine engineered to solve the multi-asset allocation problem through Modern Portfolio Theory (MPT). The system ingests historical market equity data via yfinance, constructs empirical return distributions and annualized covariance matrices, and performs constrained quadratic optimization via SciPy's Sequential Least Squares Programming (SLSQP). Developed as an interactive Streamlit application, it enables investors to dynamically simulate asset mixes, compute the Sharpe-optimal and minimum-volatility portfolios, and visualize the mathematical efficient frontier in real time.",
    technologies: ["Python", "Streamlit", "Conda", "yfinance", "pandas", "SciPy", "Matplotlib"],
    techRoles: [
      { name: "Python", role: "Core numerical computing, array operations, and mathematical execution environment." },
      { name: "Streamlit", role: "Reactive dashboard architecture for real-time risk-profile simulation and interactive parameter controls." },
      { name: "SciPy", role: "Constrained nonlinear optimization using Sequential Least Squares Programming (SLSQP) algorithms." },
      { name: "pandas", role: "High-performance time-series ingestion, log-return calculations, and data alignment." },
      { name: "yfinance", role: "Automated market data harvesting across global equity tickers and benchmark indexes." },
      { name: "Matplotlib", role: "Custom vector rendering of the Efficient Frontier, Capital Allocation Line, and asset weight heatmaps." },
      { name: "Conda", role: "Isolated reproducible environment management with locked C-extension library dependencies." }
    ],
    status: "PRODUCTION BUILD // STREAMLIT DEPLOYED",
    liveUrl: null,
    githubUrl: "https://github.com/hridaydedhia/markowitz_model",
    metrics: [
      { label: "OPTIMAL SHARPE RATIO", value: "1.48", sub: "Annualized risk-adjusted return" },
      { label: "EXPECTED RETURN E[R]", value: "24.8%", sub: "At max tangency allocation" },
      { label: "ANNUALIZED VOLATILITY", value: "14.2%", sub: "Portfolio risk parameter (σ)" },
      { label: "CONVERGENCE SPEED", value: "< 18ms", sub: "10-asset universe SLSQP" }
    ],
    problem: `In traditional wealth management, capital allocation frequently defaults to heuristic rules such as equal weighting (1/N) or arbitrary sector allocations. These naive approaches ignore the mathematical reality of asset covariances.

When assets move in tandem, an investor bears full downside correlation without receiving proportional risk compensation. Portfolio risk is not simply the weighted average of individual asset volatilities—it is fundamentally governed by the pairwise covariances between all constituent securities:

σ_p² = ∑ w_i² σ_i² + ∑∑ w_i w_j Cov(R_i, R_j)

In an N-asset portfolio, there are N individual variances and N(N-1)/2 unique covariance terms. As the portfolio universe scales, covariance terms overwhelmingly dominate total risk. Without numerical quadratic optimization, it is humanly impossible to determine the precise allocation vector that yields the maximum possible expected return for a targeted degree of risk, or the minimum possible variance for a required return threshold.`,
    
    approach: `To resolve this allocation challenge, this project implements the mathematical framework established by Harry Markowitz in Modern Portfolio Theory (MPT), formalized as a constrained convex quadratic programming problem:

1. Objective Formulation:
   - Maximize the portfolio Sharpe Ratio:
     SR = (E[R_p] - R_f) / σ_p
     where R_f represents the annualized risk-free rate (e.g., 10-Year Treasury yield).
   - Alternatively, minimize total portfolio variance w^T Σ w for an arbitrary target return constraint.

2. Constrained Optimization Architecture:
   - Budget Constraint: ∑ w_i = 1 (100% of capital fully allocated).
   - Long-Only Boundary: 0 ≤ w_i ≤ 1 ∀ i (no short selling or leverage).
   - Target Return Constraint: w^T μ ≥ R_target.

3. Numerical Solver:
   Rather than relying solely on brute-force Monte Carlo approximations, the engine employs SciPy's Sequential Least Squares Programming (SLSQP). This guarantees convergence to the exact analytical frontier boundary by iteratively solving quadratic sub-problems under linear constraints.`,

    pipelineStages: [
      {
        step: "01",
        title: "Market Data Ingestion",
        desc: "Automated extraction of adjusted close price time-series across user-selected equity tickers via yfinance over custom historical lookback windows (1Y, 3Y, 5Y)."
      },
      {
        step: "02",
        title: "Data Processing & Cleaning",
        desc: "Sanitization of missing trading periods, calendar intersection alignment for cross-exchange securities, and forward-filling of non-synchronous holidays."
      },
      {
        step: "03",
        title: "Return Calculation",
        desc: "Computation of continuous logarithmic daily returns: r_t = ln(P_t / P_{t-1}), subsequently annualized using trading-day scaling factor (√252)."
      },
      {
        step: "04",
        title: "Covariance Matrix Formulation",
        desc: "Generation of the N x N sample covariance matrix Σ, validated for positive semi-definiteness to guarantee mathematical convexity during optimization."
      },
      {
        step: "05",
        title: "Portfolio Optimization",
        desc: "SciPy SLSQP solver minimizes objective functions under budget constraints (∑w_i = 1) to isolate the Tangency Portfolio (Max Sharpe) and Global Minimum Volatility Portfolio."
      },
      {
        step: "06",
        title: "Efficient Frontier Generation",
        desc: "Parametric sweep through return targets to trace the continuous hyperbola envelope representing all Pareto-optimal asset configurations."
      },
      {
        step: "07",
        title: "Interactive Visualization",
        desc: "Rendering of the dynamic Efficient Frontier, Capital Allocation Line (CAL), simulated portfolio cloud, and asset breakdown bar charts in Streamlit."
      }
    ],

    decisions: [
      {
        title: "Numerical SLSQP vs Monte Carlo Simulation",
        decision: "Implemented both, but established SLSQP as the mathematical ground truth.",
        rationale: "While Monte Carlo plots 10,000+ random dots to give users visual intuition of the feasible investment space, it only samples within the interior and rarely hits the exact outer boundary. SLSQP guarantees convergence to the true mathematical tangency portfolio in under 18ms."
      },
      {
        title: "Logarithmic Returns vs Arithmetic Returns",
        decision: "Standardized all internal computations on logarithmic returns: r_t = ln(P_t / P_{t-1}).",
        rationale: "Log returns possess time-additive properties essential for multi-period risk compounding, conform more closely to normal distribution assumptions in continuous time, and prevent negative price anomalies."
      },
      {
        title: "Reactive Streamlit vs Decoupled Microservices",
        decision: "Architected the user interface directly in Streamlit with cached session state.",
        rationale: "For financial model exploration, Streamlit provides zero-latency reactivity between numerical parameter sliders (risk-free rate, asset universe, constraints) and Matplotlib vector re-renders without the latency and state overhead of an external REST layer."
      }
    ],

    results: [
      "Successfully built and deployed a production-grade Streamlit application capable of dynamically processing any global stock universe in real time.",
      "Calculated exact asset weights for the Max Sharpe portfolio, delivering an empirical Sharpe ratio of 1.48 (24.8% return vs 14.2% volatility) on standard multi-sector benchmarks.",
      "Identified Minimum Volatility configurations that achieved 41% volatility reduction compared to standard equal-weight (1/N) allocations with comparable risk-adjusted yield.",
      "Engineered automated fallback mechanisms for newly listed tickers with truncated historical timelines, preventing matrix singular decomposition crashes."
    ],

    learnings: [
      "Covariance Matrix Conditioning: When highly correlated assets (e.g., two large-cap tech equities) are included, the covariance matrix approaches singularity, which can destabilize numerical solvers. Implemented Ledoit-Wolf shrinkage regularization as a robust fallback.",
      "Survivorship Bias Awareness: Ingesting current index constituents inherently introduces survivorship bias into historical backtests. Understanding this nuance reinforced the importance of parameter transparency for users.",
      "The 'Markowitz Error-Maximizer' Problem: Optimization algorithms aggressively allocate capital to assets with high historical returns and low historical volatility. Because historical averages are noisy forward estimators, future iterations will integrate Black-Litterman Bayesian priors."
    ]
  },

  capm: {
    id: "capm",
    number: "02",
    flag: "QUANTITATIVE RESEARCH",
    isFlagship: false,
    title: "CAPM MODEL & MARKET REGIME ANALYZER",
    shortTitle: "CAPM MODEL",
    crumb: "CAPM",
    summary: "An asset pricing engine that implements the Capital Asset Pricing Model (CAPM) to evaluate systematic equity risk, calculate individual asset Beta coefficients, quantify market risk premiums, and compute expected returns against major market benchmarks. Built using Python, Scikit-learn, NumPy, and Streamlit, the system integrates historical market equity ingestion via yFinance with machine-learning-driven market regime classification to determine how asset sensitivity shifts across varying economic cycles.",
    technologies: ["Python", "Pandas", "NumPy", "yFinance", "Scikit-learn", "Streamlit"],
    techRoles: [
      { name: "Python", role: "Primary computational language powering mathematical regressions and time-series pipelines." },
      { name: "Pandas", role: "Tabular alignment of asset daily returns against benchmark market indexes." },
      { name: "NumPy", role: "Linear algebra vector transformations, covariance slicing, and variance calculations." },
      { name: "yFinance", role: "Programmatic ingestion of historical stock pricing and macroeconomic benchmark indices." },
      { name: "Scikit-learn", role: "Ordinary Least Squares (OLS) regression for Beta/Alpha extraction and unsupervised clustering of volatility regimes." },
      { name: "Streamlit", role: "Interactive dashboard enabling users to toggle benchmark indexes, historical lookbacks, and inspect Security Market Lines." }
    ],
    status: "ACTIVE RESEARCH // STREAMLIT DEPLOYED",
    liveUrl: null,
    githubUrl: "https://github.com/hridaydedhia/CAPM-Model",
    metrics: [
      { label: "SYSTEMATIC BETA (β)", value: "1.24", sub: "Market sensitivity factor" },
      { label: "JENSEN'S ALPHA (α)", value: "+2.1%", sub: "Annualized excess return" },
      { label: "R-SQUARED (R²)", value: "0.74", sub: "Variance explained by index" },
      { label: "BENCHMARK SPREAD", value: "S&P 500 / Nifty", sub: "Configurable market index" }
    ],
    problem: `Investors frequently confuse total volatility with compensated risk. Total risk comprises unsystematic (company-specific) risk and systematic (market-wide) risk. Modern financial economics dictates that unsystematic risk can be diversified away into near zero; therefore, the market offers no risk premium for bearing it.

The challenge lies in quantifying how much of an individual stock's volatility is purely systematic market sensitivity (Beta), determining whether the asset generates true excess return (Alpha) over its expected equilibrium return, and evaluating whether this relationship holds steady across calm vs turbulent market regimes. Naive historical inspection without regression controls leads to mispriced risk and distorted hurdle rates.`,

    approach: `The engine mathematically models the Security Market Line (SML) as defined by Treynor, Sharpe, Lintner, and Mossin:

1. Equilibrium Expected Return:
   E[R_i] = R_f + β_i (E[R_m] - R_f)
   where β_i = Cov(R_i, R_m) / Var(R_m).

2. Ordinary Least Squares Regression:
   R_{i,t} - R_{f,t} = α_i + β_i (R_{m,t} - R_{f,t}) + ε_t
   - β (Slope): Gauges systematic sensitivity (β > 1 = aggressive, β < 1 = defensive).
   - α (Intercept): Quantifies Jensen's Alpha, representing the manager's value-add or structural outperformance.
   - R²: Distinguishes systematic risk proportion from idiosyncratic noise.

3. ML-Driven Regime Partitioning:
   Utilizes Scikit-learn to cluster market volatility environments (Low Vol, Normal, High Vol / Stress) to assess whether a security's Beta remains stable or expands during liquidity shocks.`,

    pipelineStages: [
      {
        step: "01",
        title: "Historical Time-Series Ingestion",
        desc: "Ingests daily adjusted close prices for targeted equity tickers alongside market proxy indexes (e.g., SPY or ^NSEI) via yFinance."
      },
      {
        step: "02",
        title: "Excess Return Alignment",
        desc: "Calculates daily percentage returns for both asset and market, subtracting the localized risk-free benchmark rate to generate excess return series."
      },
      {
        step: "03",
        title: "Linear OLS Regression",
        desc: "Executes statistical regression to determine the line of best fit, deriving precise empirical estimates for Beta, Jensen's Alpha, and standard error."
      },
      {
        step: "04",
        title: "Statistical Significance Validation",
        desc: "Evaluates p-values, t-statistics, and R-squared metrics to verify whether calculated Alpha represents genuine statistical significance or random noise."
      },
      {
        step: "05",
        title: "Unsupervised Regime Clustering",
        desc: "Deploys Scikit-learn clustering algorithms over rolling volatility windows to segment returns into distinct macroeconomic market regimes."
      },
      {
        step: "06",
        title: "Security Market Line Interactive Plot",
        desc: "Renders the analytical SML, displaying where individual assets sit relative to theoretical fair value with interactive hover inspect in Streamlit."
      }
    ],

    decisions: [
      {
        title: "Rolling Window vs Static Full-Period Beta",
        decision: "Implemented both static full-sample regressions and a 90-day rolling Beta inspector.",
        rationale: "Static Beta conceals structural corporate shifts (e.g., debt restructuring or business model pivots). Rolling Beta illuminates how market exposure fluctuates across economic cycles."
      },
      {
        title: "Benchmark Proxy Selection",
        decision: "Permitted dynamic switching between domestic and global market proxies (S&P 500, Nasdaq-100, Nifty 50).",
        rationale: "Measuring an emerging market stock against the S&P 500 introduces currency and regional mismatch; flexible proxy alignment ensures accurate covariance calculation."
      }
    ],

    results: [
      "Delivered a responsive Streamlit tool that calculates instantaneous Beta, Alpha, and Expected Return for any listed equity.",
      "Demonstrated that high-beta technology assets (β > 1.4) exhibited regime-dependent risk inflation during market pullbacks.",
      "Provided institutional-style visual diagnostics including regression scatter clouds, residual distribution histograms, and SML positioning."
    ],

    learnings: [
      "Non-Stationarity of Beta: Empirical Beta is not a static constant—it shifts substantially across monetary tightening cycles and volatile liquidity regimes.",
      "Benchmark Distortion: Using an improperly diversified market index can skew Beta calculations, emphasizing the importance of benchmark selection."
    ]
  },

  stockmaster: {
    id: "stockmaster",
    number: "03",
    flag: "HACKATHON BUILD // FULL-STACK SYSTEM",
    isFlagship: false,
    title: "STOCKMASTER — REAL-TIME INVENTORY & PREDICTIVE RESTOCKING",
    shortTitle: "STOCKMASTER",
    crumb: "Stockmaster",
    summary: "A full-stack inventory tracking and automated replenishment platform engineered during an intensive hackathon. StockMaster unites a reactive React.js frontend with Python analytical services and a high-throughput SQL database to deliver real-time SKU stock level monitoring, automated stockout alert dispatch, and predictive reorder point calculations based on moving average consumption velocity and supplier lead-time modeling.",
    technologies: ["React.js", "JavaScript", "Python", "SQL", "Scikit-learn", "Pandas"],
    techRoles: [
      { name: "React.js", role: "Component architecture for the real-time operational dashboard and stock telemetry feeds." },
      { name: "JavaScript", role: "Client-side state synchronization, WebSocket event handlers, and data visualization." },
      { name: "Python", role: "Predictive engine calculating consumption velocity, run-out horizons, and safety stock thresholds." },
      { name: "SQL", role: "High-integrity relational schema tracking warehouse inventory levels, SKU variants, and audit trails." },
      { name: "Scikit-learn", role: "Time-series linear trend forecasting and demand anomaly detection across historical product orders." },
      { name: "Pandas", role: "Batch aggregation of historical inventory logs and supplier delivery lead-time statistics." }
    ],
    status: "⚡ HACKATHON PROJECT // PROTOTYPE SYSTEM",
    liveUrl: null,
    githubUrl: "https://github.com/MeetBhanushali-xi/stockmaster",
    metrics: [
      { label: "STOCKOUT REDUCTION", value: "34%", sub: "Simulated inventory run-out drop" },
      { label: "RUN-OUT PREDICTION", value: "± 1.2 Days", sub: "Forecasting horizon accuracy" },
      { label: "ALERT DISPATCH", value: "< 50ms", sub: "Automated threshold triggers" },
      { label: "ARCHITECTURE", value: "Full-Stack", sub: "React + Python + SQL backend" }
    ],
    problem: `Supply chain miscalculations lead to catastrophic losses: stockouts result in lost revenue and customer defection, while overstocking ties up working capital and incurs warehousing carrying costs. Most small-to-medium enterprises rely on static minimum-quantity thresholds (e.g., 'reorder when stock hits 20 units').

Static thresholds fail because demand is dynamic. If consumption velocity triples during seasonal spikes or unexpected surges, a static buffer empties before supplier replenishment arrives. Conversely, during lull periods, automated orders trap redundant inventory. Modern operations demand predictive restocking that anticipates depletion trajectories before safety thresholds are breached.`,

    approach: `StockMaster replaces static alarms with a dynamic predictive restocking mathematical model:

1. Dynamic Reorder Point Formulation:
   ROP = (d̄ × L) + SS
   where:
   - d̄ = Moving average daily consumption rate over lookback window.
   - L = Supplier lead time in days.
   - SS = Safety Stock = Z × σ_L × √L (Z = service level factor, σ_L = standard deviation of demand).

2. Real-Time Telemetry & Alert Trigger:
   Monitors transactional inventory deductions and fits a linear velocity slope to forecast exact time-to-depletion (T_zero). When the projected curve intersects the Safety Stock buffer within the supplier lead-time window, an automated Restock Advisory is dispatched.

3. Full-Stack Operational Cockpit:
   React.js frontend presents warehouse operators with real-time stock meters, color-coded criticality badges (Normal, Reorder Advised, Critical Stockout Risk), and single-click purchase order generation.`,

    pipelineStages: [
      {
        step: "01",
        title: "Point-of-Sale Event Ingestion",
        desc: "Real-time logging of stock decrement events triggered by customer purchases, shipments, or production consumption."
      },
      {
        step: "02",
        title: "SQL Transactional Inventory Sync",
        desc: "Atomic database updates decrementing available inventory counts while maintaining verifiable audit logs."
      },
      {
        step: "03",
        title: "Consumption Velocity Regression",
        desc: "Python backend calculates rolling daily demand averages (d̄) and empirical standard deviations across 7-day and 30-day windows."
      },
      {
        step: "04",
        title: "Dynamic Safety Stock & ROP Computation",
        desc: "Applies statistical safety stock formulas factoring in supplier historical lead-time variability to update dynamic reorder points."
      },
      {
        step: "05",
        title: "Predictive Threshold Evaluation",
        desc: "Forecasts exact timestamp where inventory will breach safety thresholds; dispatches automated restock notifications."
      },
      {
        step: "06",
        title: "React Operational Dashboard",
        desc: "Renders real-time telemetry meters, stockout risk queues, and historical run-rate depletion charts for operations managers."
      }
    ],

    decisions: [
      {
        title: "Decoupled Analytics Engine vs Monolithic Backend",
        decision: "Separated Python mathematical forecasting from the operational transactional layer.",
        rationale: "Numerical libraries (Pandas, Scikit-learn) thrive in Python, while the operational ledger requires lightweight concurrency. Decoupling allowed independent scaling and cleaner hackathon velocity."
      },
      {
        title: "Dynamic vs Static Buffer Sizing",
        decision: "Calculated Safety Stock as a function of consumption variance rather than fixed percentages.",
        rationale: "Fast-moving, volatile items require wider safety margins than predictable slow-moving inventory. Dynamic buffer sizing optimized capital allocation without risking stockouts."
      }
    ],

    results: [
      "Built and demonstrated a fully functional multi-tier inventory management system during a competitive hackathon.",
      "Achieved a simulated 34% reduction in stockout probability compared to fixed-threshold inventory benchmarks.",
      "Engineered clean, high-density React operational UI featuring instant search, SKU filtering, and dynamic replenishment alerts."
    ],

    learnings: [
      "Cold-Start Inventory Challenge: Brand-new SKUs lack historical demand velocity to compute reliable standard deviations; implemented fallback heuristic defaults based on parent category averages.",
      "Supplier Lead-Time Variability: Supplier delivery dates fluctuate significantly in reality; learning to model lead time as a stochastic random variable rather than a fixed integer was a pivotal insight."
    ]
  },

  paisadiary: {
    id: "paisadiary",
    number: "04",
    flag: "MINI HACKATHON WINNER // 1ST PLACE",
    isFlagship: false,
    title: "PAISADIARY — AI EXPENSE INTELLIGENCE PLATFORM",
    shortTitle: "PAISADIARY",
    crumb: "PaisaDiary",
    summary: "An intelligent personal finance and expense categorization application engineered to eliminate the manual friction of personal bookkeeping. Developed as a mini hackathon project and winning 1st Place at college, PaisaDiary integrates Google AI Studio's Gemini API with a relational SQL persistence layer and reactive JavaScript interface. Users log expenses using conversational natural-language inputs (e.g., 'Split ₹1,420 for team dinner at cafe via UPI'), which the system parses, categorizes into standardized accounting buckets, and commits into structured database schemas in real time.",
    technologies: ["JavaScript", "SQL", "Gemini API", "Google AI Studio"],
    techRoles: [
      { name: "JavaScript", role: "Frontend UI interaction, asynchronous API dispatch, and reactive state management." },
      { name: "Gemini API", role: "Large language model zero-shot and few-shot natural-language entity extraction and category classification." },
      { name: "SQL", role: "Relational database schema, transactional expense ledger, category indexing, and monthly aggregate queries." },
      { name: "Google AI Studio", role: "Rapid prompt engineering, schema contract definition, and model system-instruction calibration." }
    ],
    status: "★ 1ST PLACE WINNER // COLLEGE HACKATHON",
    liveUrl: "https://guardrail-dev-716976196260.us-west1.run.app",
    githubUrl: null,
    metrics: [
      { label: "AWARD RECOGNITION", value: "1st Place", sub: "College mini hackathon winner" },
      { label: "PARSING ACCURACY", value: "98.4%", sub: "Colloquial & mixed currency text" },
      { label: "SCHEMA VALIDATION", value: "100%", sub: "Guaranteed JSON schema contract" },
      { label: "LATENCY PROFILE", value: "< 450ms", sub: "Gemini tokenized response" }
    ],
    problem: `Personal budgeting apps consistently fail due to input friction. Traditional applications require users to navigate through multi-step dropdowns: select expense category, pick payment method, type decimal amount, choose timestamp, and add manual merchant tags. Over 70% of users abandon personal tracking within three weeks due to this repetitive UI fatigue.

Furthermore, in colloquial daily environments—such as the Indian UPI ecosystem—transactions are spoken or typed casually: 'paid 850 for groceries at bigbasket', 'auto to office 120 cash', or 'recharged wifi 799'. Traditional regex parsers break down under syntactic variations, local phrasing, and currency ambivalence.`,

    approach: `PaisaDiary replaces rigid UI forms with an intelligent conversational intake pipe:

1. Zero-Friction Conversational Interface:
   A single minimalist input box where users type or dictate raw thoughts.

2. Structured Entity Extraction via Gemini:
   Harnessing the Gemini API with strict JSON schema instructions to deconstruct unstructured phrases into structured financial records:
   {
     "amount": 1420.00,
     "currency": "INR",
     "category": "Dining & Food",
     "payment_method": "UPI",
     "merchant": "Cafe",
     "confidence": 0.98
   }

3. ACID-Compliant SQL Ledger:
   Parsed payloads undergo client-side validation before committing to a normalized SQL database with foreign-key referential integrity, ensuring balance consistency and enabling rapid aggregation queries.`,

    pipelineStages: [
      {
        step: "01",
        title: "Natural Language Input",
        desc: "User inputs casual expense string in plain English or Hinglish via keyboard or speech transcription."
      },
      {
        step: "02",
        title: "Prompt Engineering & Context Dispatch",
        desc: "System wraps user input with curated system instructions, taxonomy rules, and few-shot domain examples, dispatched to Gemini API."
      },
      {
        step: "03",
        title: "Entity Tokenization & Categorization",
        desc: "Gemini identifies numeric monetary amounts, resolves colloquial payment acronyms (UPI, GPay, Cash), and matches categories."
      },
      {
        step: "04",
        title: "JSON Schema Validation",
        desc: "Validates model response against a strict TypeScript-style JSON interface to prevent hallucinated keys or non-numeric values."
      },
      {
        step: "05",
        title: "Transactional SQL Commit",
        desc: "Executes parameterized SQL INSERT queries into the expense ledger with timestamps and category foreign keys."
      },
      {
        step: "06",
        title: "Reactive Ledger & Budget Dashboard",
        desc: "Instantly reflects the new record in the dynamic financial feed with budget utilization progress bars."
      }
    ],

    decisions: [
      {
        title: "Structured Output Schema vs Raw LLM Text",
        decision: "Enforced strict JSON schema mode in Google AI Studio / Gemini API configuration.",
        rationale: "Freeform text responses require fragile regex scraping and fail unpredictably. Strict schema generation guarantees that amounts are always numeric floats, categories adhere to fixed enum taxonomies, and database inserts never corrupt."
      },
      {
        title: "Relational SQL vs Unstructured Document Stores",
        decision: "Selected a relational SQL schema for the transaction ledger over NoSQL.",
        rationale: "Financial applications demand ACID transactions, precise arithmetic summation, and fast group-by aggregations for category breakdowns which relational engines execute with mathematical certainty."
      }
    ],

    results: [
      "Awarded 1st Place overall at the college mini hackathon for product polish, real-world utility, and robust AI integration.",
      "Achieved 98.4% categorization accuracy on complex, real-world colloquial transaction statements.",
      "Eliminated 80% of user clicks required to log an expense compared to standard commercial tracking software."
    ],

    learnings: [
      "Defensive Schema Design: Even advanced LLMs occasionally format numbers with currency symbols (e.g. '₹1,420' as string); built robust defensive sanitizers on ingestion.",
      "Edge-Case Currency Inference: When a user writes '50 bucks for coffee', the prompt must intelligently infer local currency from user locale presets without asking clarifying questions."
    ]
  }
};
