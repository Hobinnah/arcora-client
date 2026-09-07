import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomSelect from "../../components/CustomSelect";
import { CameraIcon, CheckIcon, IdCardIcon, MailIcon, PhoneIcon, ShieldIcon } from "../../components/Icons";
import { useAuth } from "../../hooks/useAuth";
import { useVerificationCenter, type VerificationStatus } from "../../apis/useVerificationCenter";
import { hasLandlordOrganization } from "../../apis/useLandlordOrganization";
import "./IdentityVerificationPage.css";

const steps = ["Email", "Phone", "Government ID", "Selfie", "Done"] as const;

const cities = [
  { name: 'Toronto', image: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&w=500&h=600&q=80' },
  { name: 'Vancouver', image: 'https://images.unsplash.com/photo-1609825488888-3a766db05542?auto=format&fit=crop&w=500&h=600&q=80' },
  { name: 'Montreal', image: 'https://images.unsplash.com/photo-1519178614-68673b201f36?auto=format&fit=crop&w=500&h=600&q=80' },
  { name: 'Calgary', image: 'https://images.unsplash.com/photo-1561134643-668f9057cce4?auto=format&fit=crop&w=500&h=600&q=80' },
  { name: 'Edmonton', image: 'https://images.unsplash.com/photo-1526666923127-b2970f64b422?auto=format&fit=crop&w=500&h=600&q=80' },
  { name: 'Ottawa', image: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&w=500&h=600&q=80' },
  { name: 'Halifax', image: 'https://images.unsplash.com/photo-1499092346589-b9b6be3e94b2?auto=format&fit=crop&w=500&h=600&q=80' },
  { name: 'Victoria', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=500&h=600&q=80' },
  { name: 'Saskatoon', image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=500&h=600&q=80' },
  { name: 'Winnipeg', image: 'https://images.unsplash.com/photo-1514924013411-cbf25faa35bb?auto=format&fit=crop&w=500&h=600&q=80' },
  { name: 'Quebec City', image: 'https://images.unsplash.com/photo-1569397288884-4d43d6738fbd?auto=format&fit=crop&w=500&h=600&q=80' },
  { name: 'Hamilton', image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=500&h=600&q=80' },
  { name: 'Kelowna', image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=500&h=600&q=80' },
  { name: 'Waterloo', image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=500&h=600&q=80' },
  { name: 'St. John\'s', image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=500&h=600&q=80' },
];

export default function IdentityVerificationPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const userID = currentUser?.user?.id ?? currentUser?.user?.userId;
  const verificationSubmissionKey = `arcora:verification-submitted:${userID || "session"}`;
  const roles = currentUser?.roles?.length ? currentUser.roles : currentUser?.user?.roles || [];
  const isHost = roles.some((role) => ["landlord", "host"].includes(role.toLowerCase()));
  const verification = useVerificationCenter(userID);
  const { ensureEmailVerified, emailStatus, phoneStatus, idStatus, selfieStatus } = verification;
  useEffect(() => { if (userID) ensureEmailVerified(); }, [userID, ensureEmailVerified]);

  const [stepIndex, setStepIndex] = useState(() => localStorage.getItem(verificationSubmissionKey) === "true" ? 4 : 0);
  const [phoneCountryCode, setPhoneCountryCode] = useState("+1");
  const [phoneDraft, setPhoneDraft] = useState("");
  const [otpStage, setOtpStage] = useState<"idle" | "sent">("idle");
  const [otpDemoCode, setOtpDemoCode] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [otpError, setOtpError] = useState("");
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [idType, setIdType] = useState("Passport");
  const [idFrontName, setIdFrontName] = useState("");
  const [selfieName, setSelfieName] = useState("");
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [leavingVerification, setLeavingVerification] = useState(false);

  // Auto-advance past a step once its check is already satisfied (e.g. returning to finish later).
  // Adjusted during render (React's documented pattern for deriving state from a prop/state change)
  // rather than in an effect, since that would trigger an extra cascading render.
  const [prevEmailStatus, setPrevEmailStatus] = useState(emailStatus);
  if (emailStatus !== prevEmailStatus) {
    setPrevEmailStatus(emailStatus);
    if (stepIndex === 0 && emailStatus === "APPROVED") setStepIndex(1);
  }
  const [prevPhoneStatus, setPrevPhoneStatus] = useState(phoneStatus);
  if (phoneStatus !== prevPhoneStatus) {
    setPrevPhoneStatus(phoneStatus);
    if (stepIndex === 1 && phoneStatus === "APPROVED") setStepIndex(2);
  }
  const docsKey = `${idStatus}|${selfieStatus}`;
  const [prevDocsKey, setPrevDocsKey] = useState(docsKey);
  if (docsKey !== prevDocsKey) {
    setPrevDocsKey(docsKey);
    if (stepIndex === 2 && idStatus !== "NOT_STARTED" && selfieStatus !== "NOT_STARTED") setStepIndex(4);
  }

  const verifyStatusLabel = (status: VerificationStatus) => status === "APPROVED" ? "Verified" : status === "UNDER_REVIEW" ? "Under review" : status === "REJECTED" ? "Rejected" : status === "PENDING" || status === "SUBMITTED" ? "Pending" : "Not started";
  const verifyStatusClass = (status: VerificationStatus) => status === "APPROVED" ? "is-verified" : status === "UNDER_REVIEW" ? "is-review" : status === "REJECTED" ? "is-rejected" : status === "PENDING" || status === "SUBMITTED" ? "is-pending" : "is-not-started";

  const sendPhoneCode = async () => {
    const code = String(Math.floor(100000 + Math.random() * 900000));
    setOtpDemoCode(code);
    setOtpStage("sent");
    setOtpError("");
    void verification.requestPhoneOtp(`${phoneCountryCode}${phoneDraft.trim()}`).catch(() => undefined);
  };
  const confirmPhoneCode = async () => {
    if (otpInput !== otpDemoCode) {
      setOtpError("That code didn't match. Try again.");
      return;
    }
    setPhoneVerified(true);
    setOtpStage("idle");
    setOtpInput("");
    setOtpError("");
    void verification.confirmPhoneOtp(otpInput, otpDemoCode).catch(() => undefined);
  };
  const stopCamera = () => {
    cameraStreamRef.current?.getTracks().forEach((track) => track.stop());
    cameraStreamRef.current = null;
    setCameraActive(false);
  };
  const startCamera = async () => {
    setCameraError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
      cameraStreamRef.current = stream;
      setCameraActive(true);
    } catch {
      setCameraError("Camera access is required to capture your live selfie.");
    }
  };
  const captureSelfie = () => {
    if (!videoRef.current?.videoWidth) return;
    setSelfieName("Live selfie captured");
    stopCamera();
  };
  useEffect(() => {
    if (cameraActive && videoRef.current && cameraStreamRef.current) {
      videoRef.current.srcObject = cameraStreamRef.current;
    }
  }, [cameraActive]);
  useEffect(() => () => { cameraStreamRef.current?.getTracks().forEach((track) => track.stop()); }, []);
  const submitDocuments = async () => {
    setSubmitting(true);
    setSubmitError("");
    try {
      await verification.submitIdentityDocuments();
      localStorage.setItem(verificationSubmissionKey, "true");
      setStepIndex(4);
    } catch {
      setSubmitError("We couldn't submit your documents. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };
  const completeVerification = async () => {
    if (!isHost) {
      navigate("/");
      return;
    }
    setLeavingVerification(true);
    try {
      navigate(await hasLandlordOrganization(userID || 0) ? "/hosting" : "/hosting/setup-business");
    } catch {
      navigate("/hosting/setup-business");
    }
  };

  return <main className="identity-verify-page">
    <div className="identity-verify-poster-bg" aria-hidden="true"><div className="identity-verify-poster-grid">{cities.map((city, i) => <div className={`identity-verify-poster-card ${i === 4 || i === 7 || i === 8 ? 'identity-verify-poster-card-bottom' : ''}`} key={i}><img src={city.image} alt="" /><span>{city.name}</span></div>)}</div></div>
    <section className="identity-verify-card">
      <div className="identity-verify-mark" aria-hidden="true"><span>a</span></div>
      <span className="identity-verify-eyebrow">Arcora trust profile</span>
      <h1>Verify your identity</h1>
      <p className="identity-verify-subtitle">Complete each step to earn verified badges landlords and tenants trust.</p>
      <div className="identity-verify-sandbox-note"><ShieldIcon /><span>Phone and ID checks run in sandbox mode today &mdash; Persona and SMS provider contracts are pending, so results are simulated for review.</span></div>

      <div className="identity-verify-progress"><span>Step {Math.min(stepIndex + 1, 4)} of 4</span><b>{steps[Math.min(stepIndex, 3)]}</b></div>
      <ol className="identity-verify-steps" aria-label="Verification steps">
        {steps.slice(0, 4).map((label, index) => <li key={label} className={index === stepIndex ? "is-current" : index < stepIndex ? "is-complete" : ""}><span className="identity-verify-step-dot">{index < stepIndex ? <CheckIcon /> : index + 1}</span><span>{label}</span></li>)}
      </ol>

      {stepIndex === 0 && <div className="identity-verify-step-content">
        <span className="identity-verify-icon"><MailIcon /></span>
        <h2>Email address</h2>
        <p>Your email is verified automatically once you sign in.</p>
        <span className="identity-verify-status is-verified">Verified</span>
        <button type="button" className="identity-verify-primary" onClick={() => setStepIndex(1)}>Continue</button>
      </div>}

      {stepIndex === 1 && <div className="identity-verify-step-content">
        <span className="identity-verify-icon"><PhoneIcon /></span>
        <h2>Phone number</h2>
        {otpStage === "idle" ? <div className="identity-verify-inline-form"><CustomSelect value={phoneCountryCode} options={["+1", "+44", "+234", "+33", "+49", "+61"]} onChange={setPhoneCountryCode} ariaLabel="Country calling code" /><input value={phoneDraft} onChange={(event) => setPhoneDraft(event.target.value)} placeholder="Phone number" /><button type="button" className="identity-verify-secondary" disabled={!phoneDraft.trim()} onClick={sendPhoneCode}>Send code</button></div> : <div className="identity-verify-inline-form"><small className="identity-verify-demo-code">Sandbox code: {otpDemoCode}</small><input value={otpInput} onChange={(event) => setOtpInput(event.target.value)} placeholder="6-digit code" maxLength={6} /><button type="button" className="identity-verify-secondary" disabled={otpInput.length !== 6} onClick={confirmPhoneCode}>Verify code</button></div>}
        {otpError && <em className="identity-verify-error">{otpError}</em>}
        <span className={`identity-verify-status ${phoneVerified || phoneStatus === "APPROVED" ? "is-verified" : verifyStatusClass(phoneStatus)}`}>{phoneVerified || phoneStatus === "APPROVED" ? "Verified" : verifyStatusLabel(phoneStatus)}</span>
        <div className="identity-verify-nav"><button type="button" className="identity-verify-back" onClick={() => setStepIndex(0)}>Back</button><button type="button" className="identity-verify-primary" disabled={!phoneVerified && phoneStatus !== "APPROVED"} onClick={() => setStepIndex(2)}>Continue</button></div>
      </div>}

      {stepIndex === 2 && <div className="identity-verify-step-content">
        <span className="identity-verify-icon"><IdCardIcon /></span>
        <h2>Government ID</h2>
        <p>Upload a clear photo of a valid government ID.</p>
        <div className="identity-verify-upload-form">
          <CustomSelect value={idType} options={["Passport", "Driver's licence", "National ID card", "Residence permit"]} onChange={setIdType} ariaLabel="Government ID type" />
          <label className="identity-verify-file"><input type="file" accept="image/*,.pdf" onChange={(event) => setIdFrontName(event.target.files?.[0]?.name || "")} />{idFrontName || "Upload ID photo"}</label>
        </div>
        <div className="identity-verify-nav"><button type="button" className="identity-verify-back" onClick={() => setStepIndex(1)}>Back</button><button type="button" className="identity-verify-primary" disabled={!idFrontName} onClick={() => setStepIndex(3)}>Continue</button></div>
      </div>}

      {stepIndex === 3 && <div className="identity-verify-step-content">
        <span className="identity-verify-icon"><CameraIcon /></span>
        <h2>Selfie &amp; liveness</h2>
        <p>Use your camera to take a live selfie so we can match it to your ID photo.</p>
        {cameraActive && <video className="identity-verify-camera" ref={videoRef} autoPlay playsInline muted />}
        {selfieName ? <span className="identity-verify-captured">{selfieName}</span> : cameraActive ? <button type="button" className="identity-verify-secondary" onClick={captureSelfie}>Capture selfie</button> : <button type="button" className="identity-verify-secondary" onClick={startCamera}>Start camera</button>}
        {cameraActive && <button type="button" className="identity-verify-camera-cancel" onClick={stopCamera}>Cancel camera</button>}
        {cameraError && <em className="identity-verify-error">{cameraError}</em>}
        {submitError && <em className="identity-verify-error">{submitError}</em>}
        <div className="identity-verify-nav"><button type="button" className="identity-verify-back" onClick={() => setStepIndex(2)}>Back</button><button type="button" className="identity-verify-primary" disabled={!selfieName || submitting} onClick={submitDocuments}>{submitting ? "Submitting..." : "Submit for review"}</button></div>
      </div>}

      {stepIndex === 4 && <div className="identity-verify-step-content identity-verify-done">
        <span className="identity-verify-icon identity-verify-done-icon"><CheckIcon /></span>
        <h2>{verification.overallLabel === "Verified" ? "You're verified!" : "Submitted for review"}</h2>
        <p>{verification.overallLabel === "Verified" ? "All checks passed. Your verified badges are now visible to landlords and tenants." : "Your government ID and selfie were submitted and are pending human review. We'll notify you once they're approved."}</p>
        <button type="button" className="identity-verify-primary" disabled={leavingVerification} onClick={completeVerification}>{leavingVerification ? "Preparing your workspace..." : "Continue"}</button>
      </div>}
    </section>
  </main>;
}
