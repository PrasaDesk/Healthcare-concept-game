import React, { useState, useEffect } from "react";
import {
  Heart,
  Star,
  Package,
  Key,
  Link,
  BookOpen,
  Trophy,
  Zap,
  Map,
  Shield,
  ArrowRight,
  CheckCircle,
  Stethoscope,
  User,
  Users,
  Activity,
  FileText,
  Calendar,
  AlertCircle,
  Brain,
  Target,
} from "lucide-react";

const FHIRAdventure = () => {
  const [gameState, setGameState] = useState("intro");
  const [currentChapter, setCurrentChapter] = useState(0);
  const [inventory, setInventory] = useState([]);
  const [health, setHealth] = useState(100);
  const [knowledge, setKnowledge] = useState(0);
  const [playerName, setPlayerName] = useState("");
  const [inputName, setInputName] = useState("");
  const [story, setStory] = useState([]);
  const [choices, setChoices] = useState([]);
  const [discoveredConcepts, setDiscoveredConcepts] = useState([]);
  const [currentMinigame, setCurrentMinigame] = useState(null);
  const [currentNPC, setCurrentNPC] = useState(null);
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [showingDialogue, setShowingDialogue] = useState(false);

  // Minigame states
  const [identifierAssignments, setIdentifierAssignments] = useState({});
  const [selectedFrom, setSelectedFrom] = useState(null);
  const [connections, setConnections] = useState([]);
  const [selectedCodes, setSelectedCodes] = useState([]);
  const [currentCodeItem, setCurrentCodeItem] = useState(0);
  const [subscriptions, setSubscriptions] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null);
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedResources, setSelectedResources] = useState([]);

  const chapters = [
    {
      id: 0,
      title: "The Identity Crisis",
      concept: "FHIR Identifiers",
      icon: Key,
      npc: {
        name: "Dr. Sarah Martinez",
        role: "Chief of Patient Registration",
        avatar: "👩‍⚕️",
        color: "#3b82f6",
      },
    },
    {
      id: 1,
      title: "The Missing Links",
      concept: "FHIR References",
      icon: Link,
      npc: {
        name: "Nurse James",
        role: "Head Nurse",
        avatar: "👨‍⚕️",
        color: "#10b981",
      },
    },
    {
      id: 2,
      title: "The Tower of Babel",
      concept: "CodeableConcepts & Terminology",
      icon: BookOpen,
      npc: {
        name: "Pharmacist Lisa Chen",
        role: "Chief Pharmacist",
        avatar: "👩‍🔬",
        color: "#8b5cf6",
      },
    },
    {
      id: 3,
      title: "The Real-Time Challenge",
      concept: "Subscriptions & Notifications",
      icon: Zap,
      npc: {
        name: "Dr. Michael Ross",
        role: "Director of IT",
        avatar: "👨‍💼",
        color: "#f59e0b",
      },
    },
    {
      id: 4,
      title: "The Data Exchange",
      concept: "FHIR Bundles & Transactions",
      icon: Package,
      npc: {
        name: "Dr. Emily Watson",
        role: "Medical Records Director",
        avatar: "👩‍💻",
        color: "#ec4899",
      },
    },
  ];

  // Enhanced scenarios with more depth
  const identifierScenarios = [
    {
      patients: [
        {
          name: "Maria Garcia",
          dob: "1985-03-12",
          location: "New York",
          ssn: "***-**-1234",
        },
        {
          name: "Maria Garcia",
          dob: "1992-07-08",
          location: "New York",
          ssn: "***-**-5678",
        },
        {
          name: "Maria Garcia",
          dob: "1985-03-12",
          location: "Boston",
          ssn: "***-**-1234",
        },
      ],
      npcDialogue: [
        "Welcome! I'm Dr. Martinez. We have a serious problem.",
        "Three patients named Maria Garcia checked in today.",
        "One needs urgent surgery, but we can't tell them apart!",
        "We need unique identifiers - MRN, SSN, Insurance ID, etc.",
        "Each patient needs at least 2 different identifiers.",
        "Can you help us set this up correctly?",
      ],
    },
    {
      patients: [
        {
          name: "John Smith Jr.",
          dob: "2010-11-20",
          location: "Chicago",
          guardian: "John Smith Sr.",
        },
        {
          name: "John Smith Sr.",
          dob: "1980-11-20",
          location: "Chicago",
          relation: "Father",
        },
        {
          name: "John Smith",
          dob: "1955-11-20",
          location: "Chicago",
          relation: "Grandfather",
        },
      ],
      npcDialogue: [
        "Another identity challenge - three generations!",
        "Father, son, and grandfather - all named John Smith.",
        "They're all in for their annual checkups today.",
        "We need to distinguish them with unique identifiers.",
        "This is why FHIR identifiers are so critical!",
      ],
    },
  ];

  const referenceScenarios = [
    {
      resources: [
        { id: "P1", type: "Patient", name: "Sarah Johnson", icon: "🧑" },
        {
          id: "O1",
          type: "Observation",
          value: "Blood Pressure: 180/110 (Critical!)",
          icon: "📊",
        },
        {
          id: "O2",
          type: "Observation",
          value: "Glucose: 85 mg/dL (Normal)",
          icon: "📈",
        },
        {
          id: "M1",
          type: "Medication",
          name: "Lisinopril 10mg for BP",
          icon: "💊",
        },
        { id: "D1", type: "Practitioner", name: "Dr. Chen", icon: "👨‍⚕️" },
        { id: "D2", type: "Practitioner", name: "Dr. Smith", icon: "👩‍⚕️" },
      ],
      correctConnections: [
        { from: "O1", to: "P1", label: "BP Observation → Patient" },
        { from: "O2", to: "P1", label: "Glucose Observation → Patient" },
        { from: "M1", to: "P1", label: "Medication → Patient" },
        { from: "M1", to: "D1", label: "Medication → Prescriber" },
        { from: "O1", to: "D2", label: "BP Observation → Performer" },
      ],
      npcDialogue: [
        "Hi, I'm Nurse James. We have a critical situation!",
        "Sarah Johnson's blood pressure is dangerously high.",
        "But our system doesn't know which observations belong to her.",
        "The medication order is floating - no patient attached!",
        "We need to link everything together using References.",
        "Connect observations to patients, medications to doctors!",
      ],
    },
    {
      resources: [
        { id: "P2", type: "Patient", name: "Robert Miller", icon: "🧑" },
        {
          id: "A1",
          type: "Allergy",
          value: "Severe Penicillin Allergy",
          icon: "⚠️",
        },
        { id: "M2", type: "Medication", name: "Amoxicillin 500mg", icon: "💊" },
        {
          id: "E1",
          type: "Encounter",
          value: "Emergency Room Visit",
          icon: "🏥",
        },
        { id: "D3", type: "Practitioner", name: "Dr. Anderson", icon: "👨‍⚕️" },
      ],
      correctConnections: [
        { from: "A1", to: "P2", label: "Allergy → Patient" },
        { from: "M2", to: "P2", label: "Medication → Patient" },
        { from: "E1", to: "P2", label: "Encounter → Patient" },
        { from: "E1", to: "D3", label: "Encounter → Practitioner" },
      ],
      npcDialogue: [
        "URGENT! Robert Miller is allergic to Penicillin!",
        "But someone just ordered Amoxicillin - a penicillin drug!",
        "Our system doesn't know the allergy belongs to him.",
        "We need proper references to prevent this disaster!",
        "Link allergies, medications, and encounters correctly!",
      ],
    },
  ];

  const codeScenarios = [
    {
      items: [
        {
          name: "Aspirin 81mg",
          description: "Low-dose aspirin for heart health",
          codes: {
            hospital: "ASA-81",
            rxnorm: "1191",
            ndc: "0781-1506-10",
          },
        },
        {
          name: "Metformin 500mg",
          description: "Diabetes medication",
          codes: {
            hospital: "MET-500",
            rxnorm: "860974",
            ndc: "0378-0321-91",
          },
        },
        {
          name: "Lisinopril 10mg",
          description: "Blood pressure medication",
          codes: {
            hospital: "LIS-10",
            rxnorm: "314076",
            ndc: "0378-0172-93",
          },
        },
      ],
      npcDialogue: [
        "I'm Lisa, the Chief Pharmacist. We have a crisis!",
        "The pharmacy uses RxNorm codes: '1191' for Aspirin.",
        "But doctors write 'ASA-81' in our hospital system.",
        "Insurance needs NDC codes like '0781-1506-10'.",
        "It's the same pill - but three different codes!",
        "We need CodeableConcepts to map them together!",
        "Select ALL codes for each medication to proceed.",
      ],
    },
    {
      items: [
        {
          name: "Complete Blood Count",
          description: "CBC lab test",
          codes: {
            hospital: "CBC",
            loinc: "58410-2",
            snomed: "26604007",
          },
        },
        {
          name: "Blood Glucose",
          description: "Fasting glucose test",
          codes: {
            hospital: "GLU",
            loinc: "2345-7",
            snomed: "33747003",
          },
        },
        {
          name: "Chest X-Ray",
          description: "Chest radiograph",
          codes: {
            hospital: "CXR",
            loinc: "36643-5",
            snomed: "399208008",
          },
        },
      ],
      npcDialogue: [
        "Now we have the same problem with lab tests!",
        "Labs use LOINC codes, doctors use hospital codes.",
        "Research databases need SNOMED codes.",
        "Without proper code mapping, data gets lost!",
        "Let's create CodeableConcepts for these tests!",
      ],
    },
  ];

  const subscriptionScenarios = [
    {
      events: [
        "Lab Result > Critical",
        "New Medication Order",
        "Patient Admitted",
        "Allergy Recorded",
        "Vital Signs Abnormal",
      ],
      actions: [
        "Email Doctor",
        "SMS Alert",
        "Dashboard Notification",
        "Pager Alert",
        "Mobile App Push",
      ],
      required: 3,
      npcDialogue: [
        "Dr. Ross here, IT Director. We need automation!",
        "Doctors miss critical alerts because they're buried in the system.",
        "A patient had a critical potassium level at 2am.",
        "The result sat in the system for 6 hours unnoticed!",
        "We need FHIR Subscriptions to auto-notify doctors.",
        "Create 3 different alert rules to save lives!",
      ],
    },
    {
      events: [
        "Drug Interaction Detected",
        "Duplicate Order",
        "Patient Discharged",
        "Appointment Scheduled",
        "Test Result Available",
      ],
      actions: [
        "Block Order",
        "Warn Provider",
        "Update Care Team",
        "Send Reminder",
        "Trigger Workflow",
      ],
      required: 3,
      npcDialogue: [
        "Let's set up more intelligent alerts!",
        "We need to prevent errors before they happen.",
        "Drug interactions should block dangerous orders.",
        "Test results should auto-notify the care team.",
        "Set up these advanced subscription rules!",
      ],
    },
  ];

  const bundleScenarios = [
    {
      resources: [
        { type: "Patient", data: "Emma Wilson, DOB: 1990-05-15", icon: "🧑" },
        { type: "Observation", data: "BP: 120/80, HR: 72", icon: "📊" },
        { type: "Observation", data: "Glucose: 95 mg/dL", icon: "📈" },
        { type: "Medication", data: "Metformin 500mg BID", icon: "💊" },
        { type: "AllergyIntolerance", data: "Penicillin - Severe", icon: "⚠️" },
        { type: "Condition", data: "Type 2 Diabetes", icon: "📋" },
      ],
      npcDialogue: [
        "Dr. Watson here. Emma is transferring to another hospital.",
        "We need to send her complete medical record.",
        "In the old days, this meant printing 200 pages!",
        "With FHIR Bundles, we send it all in one package.",
        "Select all resources to include in the Bundle.",
        "This is how modern healthcare shares data!",
      ],
    },
  ];

  const identifierTypes = [
    "Hospital MRN",
    "SSN",
    "Driver License",
    "Insurance ID",
    "Passport",
  ];

  useEffect(() => {
    if (gameState === "playing") {
      loadChapter(currentChapter);
    }
  }, [gameState, currentChapter]);

  const startGame = () => {
    if (inputName.trim()) {
      setPlayerName(inputName);
      setGameState("playing");
      setHealth(100);
      setKnowledge(0);
      setInventory([]);
      setDiscoveredConcepts([]);
      setCurrentScenario(0);
    }
  };

  const loadChapter = (chapterId) => {
    setCurrentMinigame(null);
    setSelectedFrom(null);
    setConnections([]);
    setSelectedCodes([]);
    setCurrentCodeItem(0);
    setSubscriptions([]);
    setSelectedEvent(null);
    setSelectedAction(null);
    setIdentifierAssignments({});
    setDialogueIndex(0);
    setShowingDialogue(true);
    setCurrentScenario(0);
    setSelectedResources([]);

    const chapter = chapters[chapterId];
    setCurrentNPC(chapter.npc);
  };

  const advanceDialogue = () => {
    const scenario = getCurrentScenario();
    if (!scenario) return;

    if (dialogueIndex < scenario.npcDialogue.length - 1) {
      setDialogueIndex(dialogueIndex + 1);
    } else {
      setShowingDialogue(false);
      setCurrentMinigame(getMinigameType());
    }
  };

  const getCurrentScenario = () => {
    switch (currentChapter) {
      case 0:
        return identifierScenarios[currentScenario] || identifierScenarios[0];
      case 1:
        return referenceScenarios[currentScenario] || referenceScenarios[0];
      case 2:
        return codeScenarios[currentScenario] || codeScenarios[0];
      case 3:
        return (
          subscriptionScenarios[currentScenario] || subscriptionScenarios[0]
        );
      case 4:
        return bundleScenarios[currentScenario] || bundleScenarios[0];
      default:
        return null;
    }
  };

  const getMinigameType = () => {
    switch (currentChapter) {
      case 0:
        return "identifier-builder";
      case 1:
        return "reference-linker";
      case 2:
        return "code-translator";
      case 3:
        return "subscription-builder";
      case 4:
        return "bundle-builder";
      default:
        return null;
    }
  };

  const addKnowledge = (points) => {
    setKnowledge((prev) => Math.min(100, prev + points));
  };

  const completeMinigame = () => {
    const concept = chapters[currentChapter].concept;

    // Check if there are more scenarios in this chapter
    const maxScenarios =
      currentChapter === 0
        ? identifierScenarios.length
        : currentChapter === 1
        ? referenceScenarios.length
        : currentChapter === 2
        ? codeScenarios.length
        : currentChapter === 3
        ? subscriptionScenarios.length
        : bundleScenarios.length;

    if (currentScenario < maxScenarios - 1) {
      // More scenarios in this chapter
      setCurrentScenario(currentScenario + 1);
      setDialogueIndex(0);
      setShowingDialogue(true);
      setCurrentMinigame(null);
      setIdentifierAssignments({});
      setConnections([]);
      setSelectedCodes([]);
      setCurrentCodeItem(0);
      setSubscriptions([]);
      setSelectedFrom(null);
      setSelectedResources([]);
      addKnowledge(10);
    } else {
      // Chapter complete
      setDiscoveredConcepts((prev) => [...prev, concept]);
      setInventory((prev) => [...prev, concept]);
      addKnowledge(25);

      setTimeout(() => {
        if (currentChapter < chapters.length - 1) {
          setCurrentChapter(currentChapter + 1);
          setCurrentMinigame(null);
        } else {
          setGameState("victory");
        }
      }, 1500);
    }
  };

  // Identifier Builder Logic - FIXED
  const assignIdentifier = (patientIndex, idType) => {
    const scenario = identifierScenarios[currentScenario];
    if (!scenario) return;

    const randomId = Math.floor(Math.random() * 900000) + 100000;
    const newAssignment = {
      system: `http://hospital.org/${idType.toLowerCase().replace(/ /g, "-")}`,
      value: `${idType.substring(0, 3).toUpperCase()}-${randomId}`,
      type: idType,
    };

    setIdentifierAssignments((prevAssignments) => {
      const newAssignments = { ...prevAssignments };

      if (!newAssignments[patientIndex]) {
        newAssignments[patientIndex] = [];
      }

      // Check if this identifier type is already assigned
      const alreadyHasType = newAssignments[patientIndex].some(
        (id) => id.type === idType
      );
      if (alreadyHasType) {
        return prevAssignments; // Don't add duplicate types
      }

      newAssignments[patientIndex] = [
        ...newAssignments[patientIndex],
        newAssignment,
      ];

      // Check if all patients have at least 2 identifiers
      const allAssigned = scenario.patients.every(
        (_, idx) => newAssignments[idx] && newAssignments[idx].length >= 2
      );

      if (allAssigned) {
        setTimeout(() => completeMinigame(), 1000);
      }

      return newAssignments;
    });
  };

  // Reference Linker Logic
  const createConnection = (to) => {
    const scenario = referenceScenarios[currentScenario];
    if (!scenario) return;

    if (!selectedFrom || selectedFrom === to) {
      setSelectedFrom(null);
      return;
    }

    const connectionExists = connections.some(
      (c) => c.from === selectedFrom && c.to === to
    );
    if (connectionExists) {
      setSelectedFrom(null);
      return;
    }

    const isCorrect = scenario.correctConnections.some(
      (c) => c.from === selectedFrom && c.to === to
    );

    if (!isCorrect) {
      alert(`❌ That's not a valid reference!`);
      setSelectedFrom(null);
      return;
    }

    const newConnection = { from: selectedFrom, to };
    const newConnections = [...connections, newConnection];
    setConnections(newConnections);
    setSelectedFrom(null);

    const allCorrect = scenario.correctConnections.every((correct) =>
      newConnections.some(
        (conn) => conn.from === correct.from && conn.to === correct.to
      )
    );

    if (allCorrect) {
      setTimeout(() => completeMinigame(), 1500);
    }
  };

  // Code Translator Logic
  const toggleCode = (codeName) => {
    if (selectedCodes.includes(codeName)) {
      setSelectedCodes(selectedCodes.filter((c) => c !== codeName));
    } else {
      setSelectedCodes([...selectedCodes, codeName]);
    }
  };

  const submitCodes = () => {
    const scenario = codeScenarios[currentScenario];
    if (!scenario) return;

    const item = scenario.items[currentCodeItem];
    if (selectedCodes.length === Object.keys(item.codes).length) {
      if (currentCodeItem < scenario.items.length - 1) {
        setCurrentCodeItem(currentCodeItem + 1);
        setSelectedCodes([]);
      } else {
        completeMinigame();
      }
    }
  };

  // Subscription Builder Logic
  const createSubscription = () => {
    const scenario = subscriptionScenarios[currentScenario];
    if (!scenario) return;

    if (selectedEvent && selectedAction) {
      setSubscriptions([
        ...subscriptions,
        { event: selectedEvent, action: selectedAction },
      ]);
      setSelectedEvent(null);
      setSelectedAction(null);

      if (subscriptions.length + 1 >= scenario.required) {
        setTimeout(() => completeMinigame(), 1000);
      }
    }
  };

  // Bundle Builder Logic
  const toggleResource = (index) => {
    if (selectedResources.includes(index)) {
      setSelectedResources(selectedResources.filter((i) => i !== index));
    } else {
      setSelectedResources([...selectedResources, index]);
    }
  };

  const createBundle = () => {
    const scenario = bundleScenarios[currentScenario];
    if (!scenario) return;

    if (selectedResources.length === scenario.resources.length) {
      completeMinigame();
    }
  };

  if (gameState === "intro") {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#f8fafc",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
        }}
      >
        <div
          style={{
            maxWidth: "600px",
            background: "white",
            borderRadius: "16px",
            padding: "40px",
            textAlign: "center",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            border: "1px solid #e2e8f0",
          }}
        >
          <div
            style={{
              width: "100px",
              height: "100px",
              background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
              fontSize: "50px",
            }}
          >
            🏥
          </div>
          <h1
            style={{
              fontSize: "36px",
              fontWeight: "bold",
              marginBottom: "20px",
              color: "#1e293b",
            }}
          >
            FHIR Hospital Adventure
          </h1>
          <p
            style={{
              fontSize: "18px",
              color: "#64748b",
              marginBottom: "30px",
              lineHeight: "1.6",
            }}
          >
            St. FHIR Memorial Hospital is in chaos! Data is scattered, systems
            can't talk to each other, and patients are at risk. You're the new
            Healthcare IT Specialist. Can you master FHIR and save the hospital?
          </p>
          <input
            type="text"
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            placeholder="Enter your name..."
            style={{
              width: "100%",
              padding: "15px",
              border: "2px solid #cbd5e1",
              borderRadius: "8px",
              fontSize: "16px",
              marginBottom: "20px",
              outline: "none",
              transition: "border-color 0.3s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
            onBlur={(e) => (e.target.style.borderColor = "#cbd5e1")}
            onKeyPress={(e) => e.key === "Enter" && startGame()}
          />
          <button
            onClick={startGame}
            disabled={!inputName.trim()}
            style={{
              padding: "15px 40px",
              background: inputName.trim()
                ? "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)"
                : "#cbd5e1",
              color: "white",
              fontSize: "18px",
              fontWeight: "bold",
              border: "none",
              borderRadius: "8px",
              cursor: inputName.trim() ? "pointer" : "not-allowed",
              transition: "all 0.3s",
              transform: inputName.trim() ? "scale(1)" : "scale(0.95)",
            }}
            onMouseEnter={(e) =>
              inputName.trim() && (e.target.style.transform = "scale(1.05)")
            }
            onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
          >
            Start Your Journey →
          </button>
        </div>
      </div>
    );
  }

  if (gameState === "victory") {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#f8fafc",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
        }}
      >
        <div
          style={{
            maxWidth: "700px",
            background: "white",
            borderRadius: "16px",
            padding: "40px",
            textAlign: "center",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            border: "1px solid #e2e8f0",
          }}
        >
          <div style={{ fontSize: "80px", marginBottom: "20px" }}>🏆</div>
          <h1
            style={{
              fontSize: "48px",
              fontWeight: "bold",
              marginBottom: "20px",
              color: "#1e293b",
            }}
          >
            Mission Complete!
          </h1>
          <p
            style={{ fontSize: "24px", color: "#64748b", marginBottom: "30px" }}
          >
            Congratulations, {playerName}! You've mastered FHIR and saved St.
            FHIR Memorial Hospital! 🎉
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
              marginBottom: "30px",
            }}
          >
            <div
              style={{
                background: "#fef2f2",
                padding: "20px",
                borderRadius: "12px",
                border: "2px solid #fecaca",
              }}
            >
              <Heart
                style={{
                  width: "40px",
                  height: "40px",
                  color: "#ef4444",
                  margin: "0 auto 10px",
                }}
              />
              <div
                style={{
                  fontSize: "32px",
                  fontWeight: "bold",
                  color: "#dc2626",
                }}
              >
                {health}%
              </div>
              <div style={{ fontSize: "14px", color: "#64748b" }}>Health</div>
            </div>
            <div
              style={{
                background: "#eff6ff",
                padding: "20px",
                borderRadius: "12px",
                border: "2px solid #bfdbfe",
              }}
            >
              <Star
                style={{
                  width: "40px",
                  height: "40px",
                  color: "#3b82f6",
                  margin: "0 auto 10px",
                }}
              />
              <div
                style={{
                  fontSize: "32px",
                  fontWeight: "bold",
                  color: "#2563eb",
                }}
              >
                {knowledge}%
              </div>
              <div style={{ fontSize: "14px", color: "#64748b" }}>
                Knowledge
              </div>
            </div>
          </div>

          <div
            style={{
              background: "#f8fafc",
              padding: "20px",
              borderRadius: "12px",
              marginBottom: "30px",
              border: "1px solid #e2e8f0",
            }}
          >
            <h3
              style={{
                fontWeight: "bold",
                fontSize: "20px",
                marginBottom: "15px",
                color: "#1e293b",
              }}
            >
              🎓 Concepts Mastered:
            </h3>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                justifyContent: "center",
              }}
            >
              {discoveredConcepts.map((concept, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: "10px 20px",
                    background:
                      "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
                    color: "white",
                    borderRadius: "20px",
                    fontWeight: "bold",
                    fontSize: "14px",
                  }}
                >
                  ✓ {concept}
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => {
              setGameState("intro");
              setCurrentChapter(0);
              setInputName("");
            }}
            style={{
              padding: "15px 40px",
              background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
              color: "white",
              fontSize: "18px",
              fontWeight: "bold",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "transform 0.3s",
            }}
            onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
          >
            Play Again
          </button>
        </div>
      </div>
    );
  }

  const chapter = chapters[currentChapter];
  const ChapterIcon = chapter.icon;
  const scenario = getCurrentScenario();

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", padding: "20px" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            background: "white",
            borderRadius: "12px",
            padding: "20px",
            marginBottom: "20px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            border: "1px solid #e2e8f0",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "15px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  background:
                    "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "24px",
                }}
              >
                🏥
              </div>
              <div>
                <h1
                  style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    margin: 0,
                    color: "#1e293b",
                  }}
                >
                  {playerName}'s Adventure
                </h1>
                <p style={{ fontSize: "14px", margin: 0, color: "#64748b" }}>
                  Chapter {currentChapter + 1}/{chapters.length}:{" "}
                  {chapter.title}
                </p>
              </div>
            </div>

            <div style={{ display: "flex", gap: "15px" }}>
              <div
                style={{
                  background: "#fef2f2",
                  padding: "10px 15px",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  border: "1px solid #fecaca",
                }}
              >
                <Heart
                  style={{ width: "20px", height: "20px", color: "#ef4444" }}
                />
                <span style={{ fontWeight: "bold", color: "#dc2626" }}>
                  {health}%
                </span>
              </div>
              <div
                style={{
                  background: "#eff6ff",
                  padding: "10px 15px",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  border: "1px solid #bfdbfe",
                }}
              >
                <Star
                  style={{ width: "20px", height: "20px", color: "#3b82f6" }}
                />
                <span style={{ fontWeight: "bold", color: "#2563eb" }}>
                  {knowledge}%
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            {chapters.map((_, idx) => (
              <div
                key={idx}
                style={{
                  flex: 1,
                  height: "6px",
                  borderRadius: "3px",
                  background:
                    idx < currentChapter
                      ? "#10b981"
                      : idx === currentChapter
                      ? "#3b82f6"
                      : "#e2e8f0",
                  transition: "all 0.3s",
                }}
              />
            ))}
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "20px",
          }}
        >
          {/* Main Content */}
          <div
            style={{
              background: "white",
              borderRadius: "12px",
              padding: "30px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #e2e8f0",
            }}
          >
            {/* NPC Dialogue */}
            {showingDialogue && scenario && (
              <div
                style={{
                  background: "#f8fafc",
                  borderRadius: "12px",
                  padding: "25px",
                  marginBottom: "25px",
                  border: "2px solid #e2e8f0",
                  animation: "slideIn 0.5s ease-out",
                }}
              >
                <div
                  style={{ display: "flex", gap: "20px", marginBottom: "20px" }}
                >
                  <div
                    style={{
                      width: "80px",
                      height: "80px",
                      background: currentNPC.color,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "40px",
                      flexShrink: 0,
                      border: "3px solid white",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    }}
                  >
                    {currentNPC.avatar}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3
                      style={{
                        fontSize: "20px",
                        fontWeight: "bold",
                        margin: 0,
                        color: "#1e293b",
                      }}
                    >
                      {currentNPC.name}
                    </h3>
                    <p
                      style={{
                        fontSize: "14px",
                        color: "#64748b",
                        margin: "5px 0 0 0",
                      }}
                    >
                      {currentNPC.role}
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    background: "white",
                    borderRadius: "8px",
                    padding: "20px",
                    marginBottom: "20px",
                    border: "1px solid #e2e8f0",
                    minHeight: "120px",
                    position: "relative",
                  }}
                >
                  <p
                    style={{
                      fontSize: "16px",
                      color: "#334155",
                      lineHeight: "1.6",
                      margin: 0,
                      animation: "fadeIn 0.5s ease-out",
                    }}
                  >
                    {scenario.npcDialogue[dialogueIndex]}
                  </p>
                  <div
                    style={{
                      position: "absolute",
                      bottom: "10px",
                      right: "15px",
                      fontSize: "12px",
                      color: "#94a3b8",
                    }}
                  >
                    {dialogueIndex + 1} / {scenario.npcDialogue.length}
                  </div>
                </div>

                <button
                  onClick={advanceDialogue}
                  style={{
                    width: "100%",
                    padding: "15px",
                    background:
                      dialogueIndex < scenario.npcDialogue.length - 1
                        ? "#3b82f6"
                        : "#10b981",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "16px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    transition: "all 0.3s",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.transform = "scale(1.02)")
                  }
                  onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
                >
                  {dialogueIndex < scenario.npcDialogue.length - 1 ? (
                    <>
                      Continue{" "}
                      <ArrowRight style={{ width: "20px", height: "20px" }} />
                    </>
                  ) : (
                    <>
                      Start Challenge!{" "}
                      <Zap style={{ width: "20px", height: "20px" }} />
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Identifier Builder Minigame */}
            {!showingDialogue &&
              currentMinigame === "identifier-builder" &&
              scenario && (
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "15px",
                      marginBottom: "20px",
                    }}
                  >
                    <Key
                      style={{
                        width: "32px",
                        height: "32px",
                        color: "#3b82f6",
                      }}
                    />
                    <h3
                      style={{
                        fontSize: "24px",
                        fontWeight: "bold",
                        margin: 0,
                        color: "#1e293b",
                      }}
                    >
                      🔑 Identifier Builder
                    </h3>
                  </div>

                  <div
                    style={{
                      background: "#fef3c7",
                      border: "2px solid #fbbf24",
                      borderRadius: "8px",
                      padding: "15px",
                      marginBottom: "20px",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: "bold",
                        marginBottom: "5px",
                        color: "#92400e",
                      }}
                    >
                      🎯 Mission: Assign at least 2 unique identifiers to each
                      patient
                    </div>
                    <div style={{ fontSize: "14px", color: "#78350f" }}>
                      Different identifier types help distinguish patients with
                      similar names
                    </div>
                  </div>

                  {scenario.patients.map((patient, idx) => (
                    <div
                      key={idx}
                      style={{
                        border: "2px solid #e2e8f0",
                        borderRadius: "12px",
                        padding: "20px",
                        marginBottom: "15px",
                        background: "#fafafa",
                        transition: "all 0.3s",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "15px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            gap: "15px",
                            alignItems: "center",
                          }}
                        >
                          <div
                            style={{
                              width: "60px",
                              height: "60px",
                              background:
                                "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "30px",
                            }}
                          >
                            👤
                          </div>
                          <div>
                            <div
                              style={{
                                fontWeight: "bold",
                                fontSize: "18px",
                                marginBottom: "5px",
                                color: "#1e293b",
                              }}
                            >
                              {patient.name}
                            </div>
                            <div style={{ fontSize: "14px", color: "#64748b" }}>
                              DOB: {patient.dob}
                            </div>
                            <div style={{ fontSize: "14px", color: "#64748b" }}>
                              Location: {patient.location}
                            </div>
                            {patient.ssn && (
                              <div
                                style={{ fontSize: "14px", color: "#64748b" }}
                              >
                                SSN: {patient.ssn}
                              </div>
                            )}
                            {patient.guardian && (
                              <div
                                style={{ fontSize: "14px", color: "#64748b" }}
                              >
                                Guardian: {patient.guardian}
                              </div>
                            )}
                          </div>
                        </div>
                        <Shield
                          style={{
                            width: "32px",
                            height: "32px",
                            color:
                              identifierAssignments[idx]?.length >= 2
                                ? "#10b981"
                                : "#cbd5e1",
                          }}
                        />
                      </div>

                      {identifierAssignments[idx] &&
                        identifierAssignments[idx].length > 0 && (
                          <div style={{ marginBottom: "15px" }}>
                            {identifierAssignments[idx].map((id, idIdx) => (
                              <div
                                key={idIdx}
                                style={{
                                  background: "#d1fae5",
                                  border: "1px solid #10b981",
                                  borderRadius: "8px",
                                  padding: "12px",
                                  marginBottom: "8px",
                                  fontSize: "13px",
                                  fontFamily: "monospace",
                                  animation: "slideIn 0.3s ease-out",
                                }}
                              >
                                <div
                                  style={{
                                    color: "#64748b",
                                    fontSize: "11px",
                                    marginBottom: "4px",
                                  }}
                                >
                                  System: {id.system}
                                </div>
                                <div
                                  style={{
                                    fontWeight: "bold",
                                    color: "#059669",
                                    fontSize: "14px",
                                  }}
                                >
                                  Value: {id.value}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                          flexWrap: "wrap",
                        }}
                      >
                        {identifierTypes.map((idType, typeIdx) => {
                          const alreadyAssigned = identifierAssignments[
                            idx
                          ]?.some((id) => id.type === idType);
                          return (
                            <button
                              key={typeIdx}
                              onClick={() => assignIdentifier(idx, idType)}
                              disabled={alreadyAssigned}
                              style={{
                                padding: "10px 16px",
                                background: alreadyAssigned
                                  ? "#cbd5e1"
                                  : "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
                                color: "white",
                                border: "none",
                                borderRadius: "6px",
                                fontSize: "14px",
                                cursor: alreadyAssigned
                                  ? "not-allowed"
                                  : "pointer",
                                transition: "transform 0.2s",
                                fontWeight: "500",
                                opacity: alreadyAssigned ? 0.5 : 1,
                              }}
                              onMouseEnter={(e) =>
                                !alreadyAssigned &&
                                (e.target.style.transform = "scale(1.05)")
                              }
                              onMouseLeave={(e) =>
                                (e.target.style.transform = "scale(1)")
                              }
                            >
                              {alreadyAssigned ? `✓ ${idType}` : `+ ${idType}`}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

            {/* Reference Linker Minigame */}
            {!showingDialogue &&
              currentMinigame === "reference-linker" &&
              scenario && (
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "15px",
                      marginBottom: "20px",
                    }}
                  >
                    <Link
                      style={{
                        width: "32px",
                        height: "32px",
                        color: "#3b82f6",
                      }}
                    />
                    <h3
                      style={{
                        fontSize: "24px",
                        fontWeight: "bold",
                        margin: 0,
                        color: "#1e293b",
                      }}
                    >
                      🔗 Reference Linker
                    </h3>
                  </div>

                  <div
                    style={{
                      background: "#fef3c7",
                      border: "2px solid #fbbf24",
                      borderRadius: "8px",
                      padding: "15px",
                      marginBottom: "20px",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: "bold",
                        marginBottom: "10px",
                        color: "#92400e",
                      }}
                    >
                      🎯 Create these references:
                    </div>
                    <div
                      style={{
                        fontSize: "14px",
                        color: "#78350f",
                        lineHeight: "1.8",
                      }}
                    >
                      {scenario.correctConnections.map((conn, idx) => {
                        const isComplete = connections.some(
                          (c) => c.from === conn.from && c.to === conn.to
                        );
                        return (
                          <div
                            key={idx}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                            }}
                          >
                            {isComplete ? (
                              <CheckCircle
                                style={{
                                  width: "16px",
                                  height: "16px",
                                  color: "#10b981",
                                }}
                              />
                            ) : (
                              <div
                                style={{
                                  width: "16px",
                                  height: "16px",
                                  border: "2px solid #cbd5e1",
                                  borderRadius: "50%",
                                }}
                              />
                            )}
                            <span
                              style={{
                                textDecoration: isComplete
                                  ? "line-through"
                                  : "none",
                              }}
                            >
                              {conn.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <p style={{ marginBottom: "20px", color: "#64748b" }}>
                    Click a resource, then click another to create a reference.
                    Only valid connections work!
                  </p>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(250px, 1fr))",
                      gap: "15px",
                      marginBottom: "20px",
                    }}
                  >
                    {scenario.resources.map((resource) => {
                      const isSelected = selectedFrom === resource.id;
                      const isConnected = connections.some(
                        (c) => c.from === resource.id || c.to === resource.id
                      );

                      return (
                        <button
                          key={resource.id}
                          onClick={() =>
                            selectedFrom
                              ? createConnection(resource.id)
                              : setSelectedFrom(resource.id)
                          }
                          style={{
                            padding: "20px",
                            border: `3px solid ${
                              isSelected ? "#3b82f6" : "#e2e8f0"
                            }`,
                            borderRadius: "12px",
                            cursor: "pointer",
                            background: isSelected ? "#eff6ff" : "white",
                            textAlign: "left",
                            transition: "all 0.3s",
                            transform: isSelected ? "scale(1.05)" : "scale(1)",
                          }}
                        >
                          <div
                            style={{ fontSize: "32px", marginBottom: "10px" }}
                          >
                            {resource.icon}
                          </div>
                          <div
                            style={{
                              fontWeight: "bold",
                              marginBottom: "5px",
                              fontSize: "16px",
                              color: "#1e293b",
                            }}
                          >
                            {resource.type}
                          </div>
                          <div
                            style={{
                              fontSize: "14px",
                              color: "#64748b",
                              marginBottom: "8px",
                            }}
                          >
                            {resource.name || resource.value}
                          </div>
                          <div
                            style={{
                              fontSize: "12px",
                              color: "#94a3b8",
                              fontFamily: "monospace",
                            }}
                          >
                            ID: {resource.id}
                          </div>
                          {isConnected && (
                            <div
                              style={{
                                marginTop: "8px",
                                fontSize: "12px",
                                color: "#10b981",
                                fontWeight: "bold",
                              }}
                            >
                              ✓ Connected
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {connections.length > 0 && (
                    <div
                      style={{
                        padding: "15px",
                        background: "#d1fae5",
                        border: "2px solid #10b981",
                        borderRadius: "8px",
                        animation: "slideIn 0.3s ease-out",
                      }}
                    >
                      <div
                        style={{
                          fontWeight: "bold",
                          marginBottom: "10px",
                          color: "#059669",
                        }}
                      >
                        ✓ Valid Connections Made ({connections.length}/
                        {scenario.correctConnections.length}):
                      </div>
                      {connections.map((conn, idx) => (
                        <div
                          key={idx}
                          style={{
                            fontSize: "14px",
                            fontFamily: "monospace",
                            color: "#374151",
                            marginBottom: "5px",
                            padding: "8px",
                            background: "white",
                            borderRadius: "6px",
                          }}
                        >
                          {conn.from} → {conn.to}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            {/* Code Translator Minigame */}
            {!showingDialogue &&
              currentMinigame === "code-translator" &&
              scenario && (
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "15px",
                      marginBottom: "20px",
                    }}
                  >
                    <BookOpen
                      style={{
                        width: "32px",
                        height: "32px",
                        color: "#3b82f6",
                      }}
                    />
                    <h3
                      style={{
                        fontSize: "24px",
                        fontWeight: "bold",
                        margin: 0,
                        color: "#1e293b",
                      }}
                    >
                      🌐 Code Translator
                    </h3>
                  </div>

                  <div
                    style={{
                      padding: "25px",
                      background:
                        "linear-gradient(135deg, #eff6ff 0%, #f3e8ff 100%)",
                      borderRadius: "12px",
                      marginBottom: "25px",
                      border: "2px solid #3b82f6",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: "40px", marginBottom: "10px" }}>
                      💊
                    </div>
                    <div
                      style={{
                        fontSize: "28px",
                        fontWeight: "bold",
                        marginBottom: "10px",
                        color: "#1e293b",
                      }}
                    >
                      {scenario.items[currentCodeItem].name}
                    </div>
                    <div
                      style={{
                        fontSize: "16px",
                        color: "#64748b",
                        marginBottom: "10px",
                      }}
                    >
                      {scenario.items[currentCodeItem].description}
                    </div>
                    <div style={{ fontSize: "14px", color: "#64748b" }}>
                      Item {currentCodeItem + 1} of {scenario.items.length}
                    </div>
                  </div>

                  <div
                    style={{
                      background: "#fef3c7",
                      border: "2px solid #fbbf24",
                      borderRadius: "8px",
                      padding: "15px",
                      marginBottom: "20px",
                    }}
                  >
                    <div style={{ fontWeight: "bold", color: "#92400e" }}>
                      🎯 Select ALL codes to create a CodeableConcept
                    </div>
                  </div>

                  <div style={{ marginBottom: "20px" }}>
                    {Object.entries(scenario.items[currentCodeItem].codes).map(
                      ([system, code]) => (
                        <button
                          key={system}
                          onClick={() => toggleCode(system)}
                          style={{
                            width: "100%",
                            padding: "20px",
                            marginBottom: "10px",
                            border: `2px solid ${
                              selectedCodes.includes(system)
                                ? "#3b82f6"
                                : "#e2e8f0"
                            }`,
                            borderRadius: "12px",
                            background: selectedCodes.includes(system)
                              ? "#eff6ff"
                              : "white",
                            cursor: "pointer",
                            textAlign: "left",
                            transition: "all 0.3s",
                          }}
                          onMouseEnter={(e) =>
                            (e.target.style.transform = "scale(1.02)")
                          }
                          onMouseLeave={(e) =>
                            (e.target.style.transform = "scale(1)")
                          }
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <div>
                              <div
                                style={{
                                  fontWeight: "bold",
                                  marginBottom: "5px",
                                  fontSize: "16px",
                                  color: "#1e293b",
                                }}
                              >
                                {system.toUpperCase()} System
                              </div>
                              <div
                                style={{
                                  fontSize: "18px",
                                  fontFamily: "monospace",
                                  color: "#3b82f6",
                                  fontWeight: "bold",
                                }}
                              >
                                {code}
                              </div>
                            </div>
                            {selectedCodes.includes(system) && (
                              <CheckCircle
                                style={{
                                  width: "24px",
                                  height: "24px",
                                  color: "#10b981",
                                  fill: "#10b981",
                                }}
                              />
                            )}
                          </div>
                        </button>
                      )
                    )}
                  </div>

                  <button
                    onClick={submitCodes}
                    disabled={selectedCodes.length === 0}
                    style={{
                      width: "100%",
                      padding: "15px",
                      background:
                        selectedCodes.length > 0
                          ? "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)"
                          : "#cbd5e1",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "18px",
                      fontWeight: "bold",
                      cursor:
                        selectedCodes.length > 0 ? "pointer" : "not-allowed",
                      transition: "transform 0.3s",
                    }}
                    onMouseEnter={(e) =>
                      selectedCodes.length > 0 &&
                      (e.target.style.transform = "scale(1.02)")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.transform = "scale(1)")
                    }
                  >
                    Create CodeableConcept
                  </button>
                </div>
              )}

            {/* Subscription Builder Minigame */}
            {!showingDialogue &&
              currentMinigame === "subscription-builder" &&
              scenario && (
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "15px",
                      marginBottom: "20px",
                    }}
                  >
                    <Zap
                      style={{
                        width: "32px",
                        height: "32px",
                        color: "#3b82f6",
                      }}
                    />
                    <h3
                      style={{
                        fontSize: "24px",
                        fontWeight: "bold",
                        margin: 0,
                        color: "#1e293b",
                      }}
                    >
                      ⚡ Subscription Builder
                    </h3>
                  </div>

                  <div
                    style={{
                      background: "#fef3c7",
                      border: "2px solid #fbbf24",
                      borderRadius: "8px",
                      padding: "15px",
                      marginBottom: "20px",
                    }}
                  >
                    <div style={{ fontWeight: "bold", color: "#92400e" }}>
                      🎯 Create {scenario.required} automated alerts
                    </div>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "20px",
                      marginBottom: "20px",
                    }}
                  >
                    <div>
                      <h4
                        style={{
                          fontWeight: "bold",
                          marginBottom: "10px",
                          color: "#1e293b",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <Activity style={{ width: "20px", height: "20px" }} />
                        Watch for Event:
                      </h4>
                      {scenario.events.map((event, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedEvent(event)}
                          style={{
                            width: "100%",
                            padding: "15px",
                            marginBottom: "8px",
                            border: `2px solid ${
                              selectedEvent === event ? "#3b82f6" : "#e2e8f0"
                            }`,
                            borderRadius: "8px",
                            background:
                              selectedEvent === event ? "#eff6ff" : "white",
                            textAlign: "left",
                            cursor: "pointer",
                            transition: "all 0.3s",
                            fontWeight:
                              selectedEvent === event ? "bold" : "normal",
                            color: "#1e293b",
                          }}
                          onMouseEnter={(e) =>
                            (e.target.style.transform = "scale(1.02)")
                          }
                          onMouseLeave={(e) =>
                            (e.target.style.transform = "scale(1)")
                          }
                        >
                          {event}
                        </button>
                      ))}
                    </div>

                    <div>
                      <h4
                        style={{
                          fontWeight: "bold",
                          marginBottom: "10px",
                          color: "#1e293b",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <Target style={{ width: "20px", height: "20px" }} />
                        Trigger Action:
                      </h4>
                      {scenario.actions.map((action, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedAction(action)}
                          style={{
                            width: "100%",
                            padding: "15px",
                            marginBottom: "8px",
                            border: `2px solid ${
                              selectedAction === action ? "#10b981" : "#e2e8f0"
                            }`,
                            borderRadius: "8px",
                            background:
                              selectedAction === action ? "#d1fae5" : "white",
                            textAlign: "left",
                            cursor: "pointer",
                            transition: "all 0.3s",
                            fontWeight:
                              selectedAction === action ? "bold" : "normal",
                            color: "#1e293b",
                          }}
                          onMouseEnter={(e) =>
                            (e.target.style.transform = "scale(1.02)")
                          }
                          onMouseLeave={(e) =>
                            (e.target.style.transform = "scale(1)")
                          }
                        >
                          {action}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={createSubscription}
                    disabled={!selectedEvent || !selectedAction}
                    style={{
                      width: "100%",
                      padding: "15px",
                      marginBottom: "20px",
                      background:
                        selectedEvent && selectedAction
                          ? "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)"
                          : "#cbd5e1",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "18px",
                      fontWeight: "bold",
                      cursor:
                        selectedEvent && selectedAction
                          ? "pointer"
                          : "not-allowed",
                      transition: "transform 0.3s",
                    }}
                    onMouseEnter={(e) =>
                      selectedEvent &&
                      selectedAction &&
                      (e.target.style.transform = "scale(1.02)")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.transform = "scale(1)")
                    }
                  >
                    Create Subscription
                  </button>

                  {subscriptions.length > 0 && (
                    <div
                      style={{
                        padding: "15px",
                        background: "#d1fae5",
                        border: "2px solid #10b981",
                        borderRadius: "8px",
                        animation: "slideIn 0.3s ease-out",
                      }}
                    >
                      <h4
                        style={{
                          fontWeight: "bold",
                          marginBottom: "10px",
                          color: "#059669",
                        }}
                      >
                        ✓ Active Subscriptions ({subscriptions.length}/
                        {scenario.required}):
                      </h4>
                      {subscriptions.map((sub, idx) => (
                        <div
                          key={idx}
                          style={{
                            padding: "12px",
                            background: "white",
                            borderRadius: "8px",
                            marginBottom: "8px",
                            fontSize: "14px",
                            color: "#1e293b",
                          }}
                        >
                          When{" "}
                          <span
                            style={{ fontWeight: "bold", color: "#3b82f6" }}
                          >
                            {sub.event}
                          </span>{" "}
                          →{" "}
                          <span
                            style={{ fontWeight: "bold", color: "#10b981" }}
                          >
                            {sub.action}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            {/* Bundle Builder Minigame */}
            {!showingDialogue &&
              currentMinigame === "bundle-builder" &&
              scenario && (
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "15px",
                      marginBottom: "20px",
                    }}
                  >
                    <Package
                      style={{
                        width: "32px",
                        height: "32px",
                        color: "#3b82f6",
                      }}
                    />
                    <h3
                      style={{
                        fontSize: "24px",
                        fontWeight: "bold",
                        margin: 0,
                        color: "#1e293b",
                      }}
                    >
                      📦 Bundle Builder
                    </h3>
                  </div>

                  <div
                    style={{
                      background: "#fef3c7",
                      border: "2px solid #fbbf24",
                      borderRadius: "8px",
                      padding: "15px",
                      marginBottom: "20px",
                    }}
                  >
                    <div style={{ fontWeight: "bold", color: "#92400e" }}>
                      🎯 Select ALL resources to include in the transfer bundle
                    </div>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(200px, 1fr))",
                      gap: "15px",
                      marginBottom: "20px",
                    }}
                  >
                    {scenario.resources.map((resource, idx) => (
                      <button
                        key={idx}
                        onClick={() => toggleResource(idx)}
                        style={{
                          padding: "20px",
                          border: `2px solid ${
                            selectedResources.includes(idx)
                              ? "#3b82f6"
                              : "#e2e8f0"
                          }`,
                          borderRadius: "12px",
                          background: selectedResources.includes(idx)
                            ? "#eff6ff"
                            : "white",
                          cursor: "pointer",
                          textAlign: "center",
                          transition: "all 0.3s",
                        }}
                        onMouseEnter={(e) =>
                          (e.target.style.transform = "scale(1.05)")
                        }
                        onMouseLeave={(e) =>
                          (e.target.style.transform = "scale(1)")
                        }
                      >
                        <div style={{ fontSize: "40px", marginBottom: "10px" }}>
                          {resource.icon}
                        </div>
                        <div
                          style={{
                            fontWeight: "bold",
                            fontSize: "16px",
                            marginBottom: "5px",
                            color: "#1e293b",
                          }}
                        >
                          {resource.type}
                        </div>
                        <div style={{ fontSize: "14px", color: "#64748b" }}>
                          {resource.data}
                        </div>
                        {selectedResources.includes(idx) && (
                          <div style={{ marginTop: "10px" }}>
                            <CheckCircle
                              style={{
                                width: "24px",
                                height: "24px",
                                color: "#10b981",
                                margin: "0 auto",
                              }}
                            />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={createBundle}
                    disabled={
                      selectedResources.length !== scenario.resources.length
                    }
                    style={{
                      width: "100%",
                      padding: "15px",
                      background:
                        selectedResources.length === scenario.resources.length
                          ? "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)"
                          : "#cbd5e1",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "18px",
                      fontWeight: "bold",
                      cursor:
                        selectedResources.length === scenario.resources.length
                          ? "pointer"
                          : "not-allowed",
                      transition: "transform 0.3s",
                    }}
                    onMouseEnter={(e) =>
                      selectedResources.length === scenario.resources.length &&
                      (e.target.style.transform = "scale(1.02)")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.transform = "scale(1)")
                    }
                  >
                    Create Bundle & Transfer ({selectedResources.length}/
                    {scenario.resources.length})
                  </button>
                </div>
              )}
          </div>

          {/* Inventory Panel */}
          <div
            style={{
              background: "white",
              borderRadius: "12px",
              padding: "25px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #e2e8f0",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "20px",
              }}
            >
              <Package
                style={{ width: "24px", height: "24px", color: "#3b82f6" }}
              />
              <h3
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  margin: 0,
                  color: "#1e293b",
                }}
              >
                Progress
              </h3>
            </div>

            <div
              style={{
                background: "#f8fafc",
                borderRadius: "8px",
                padding: "15px",
                marginBottom: "20px",
                border: "1px solid #e2e8f0",
              }}
            >
              <div
                style={{
                  fontSize: "14px",
                  color: "#64748b",
                  marginBottom: "10px",
                }}
              >
                Current Chapter:
              </div>
              <div
                style={{
                  fontWeight: "bold",
                  fontSize: "16px",
                  color: "#1e293b",
                  marginBottom: "10px",
                }}
              >
                {chapter.title}
              </div>
              <div
                style={{
                  fontSize: "14px",
                  color: "#64748b",
                  marginBottom: "5px",
                }}
              >
                Scenario {currentScenario + 1} of{" "}
                {currentChapter === 0
                  ? identifierScenarios.length
                  : currentChapter === 1
                  ? referenceScenarios.length
                  : currentChapter === 2
                  ? codeScenarios.length
                  : currentChapter === 3
                  ? subscriptionScenarios.length
                  : bundleScenarios.length}
              </div>
            </div>

            <div
              style={{
                borderTop: "2px solid #e2e8f0",
                paddingTop: "20px",
                marginBottom: "20px",
              }}
            >
              <h4
                style={{
                  fontWeight: "bold",
                  marginBottom: "15px",
                  color: "#1e293b",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <Brain style={{ width: "20px", height: "20px" }} />
                Concepts Learned:
              </h4>
              {discoveredConcepts.length === 0 ? (
                <p
                  style={{
                    fontSize: "14px",
                    color: "#94a3b8",
                    fontStyle: "italic",
                  }}
                >
                  Complete chapters to unlock...
                </p>
              ) : (
                discoveredConcepts.map((concept, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "10px",
                      padding: "10px",
                      background: "#f8fafc",
                      borderRadius: "6px",
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    <CheckCircle
                      style={{
                        width: "16px",
                        height: "16px",
                        color: "#10b981",
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontSize: "14px",
                        color: "#059669",
                        fontWeight: "bold",
                      }}
                    >
                      {concept}
                    </span>
                  </div>
                ))
              )}
            </div>

            <div
              style={{
                background: "linear-gradient(135deg, #eff6ff 0%, #f3e8ff 100%)",
                borderRadius: "8px",
                padding: "15px",
                border: "1px solid #c7d2fe",
              }}
            >
              <div
                style={{
                  fontSize: "12px",
                  color: "#64748b",
                  marginBottom: "8px",
                }}
              >
                💡 Pro Tip:
              </div>
              <div
                style={{
                  fontSize: "14px",
                  color: "#4338ca",
                  lineHeight: "1.5",
                }}
              >
                {currentChapter === 0 &&
                  "Different identifier systems help uniquely identify patients across healthcare systems."}
                {currentChapter === 1 &&
                  "References link FHIR resources together, creating a complete patient story."}
                {currentChapter === 2 &&
                  "CodeableConcepts allow the same medical concept to be represented in multiple coding systems."}
                {currentChapter === 3 &&
                  "Subscriptions enable real-time notifications when important events occur."}
                {currentChapter === 4 &&
                  "Bundles package multiple resources together for efficient data exchange."}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default FHIRAdventure;
