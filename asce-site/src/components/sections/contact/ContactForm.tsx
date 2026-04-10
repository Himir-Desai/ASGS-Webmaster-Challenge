import { useState, type FormEvent } from "react";

type Values = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

type Errors = Partial<Record<keyof Values, string>>;

const EMAIL_TO = "desai.himir@gmail.com";

function normalize(v: Values): Values {
  // Keep mailto payload clean and validation consistent.
  return {
    name: v.name.trim(),
    email: v.email.trim(),
    subject: v.subject.trim(),
    message: v.message.trim(),
  };
}

function validate(values: Values): Errors {
  // Returns field-specific error messages; empty object means valid.
  const v = normalize(values);
  const errors: Errors = {};

  if (!v.name) errors.name = "Name is required.";

  if (!v.email) {
    errors.email = "Email is required.";
  } else {
    // Pragmatic email check (avoid over-restrictive rules).
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email);
    if (!ok) errors.email = "Enter a valid email address.";
  }

  if (!v.message) errors.message = "Message is required.";
  if (!v.subject) errors.subject = "Subject is required.";

  return errors;
}

export default function ContactForm() {
  // Controlled field values for the form inputs/textarea.
  const [values, setValues] = useState<Values>({ name: "", email: "", subject: "", message: "" });
  // Tracks whether a field has been interacted with (used to decide when to show errors).
  const [touched, setTouched] = useState<Record<keyof Values, boolean>>({
    name: false,
    email: false,
    subject: false,
    message: false,
  });

  // Derived validation state for current values.
  const errors = validate(values);
  const isValid = Object.keys(errors).length === 0;

  function onBlur(field: keyof Values) {
    // Mark a field as touched so its validation message can appear.
    setTouched((t) => ({ ...t, [field]: true }));
  }

  function onChange(field: keyof Values, next: string) {
    // Update a single field (skip state update if unchanged).
    setValues((v) => (v[field] === next ? v : { ...v, [field]: next }));
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    // On submit, reveal all validation errors at once.
    setTouched({ name: true, email: true, subject: true, message: true });

    const v = normalize(values);
    const nextErrors = validate(v);
    if (Object.keys(nextErrors).length > 0) return;

    // Compose the mailto: URL (opens user email client with a pre-filled draft).
    const body = `Name: ${v.name}\nEmail: ${v.email}\nSubject: ${v.subject}\n\nMessage:\n${v.message}\n`;
    const href = `mailto:${EMAIL_TO}?subject=${encodeURIComponent(v.subject)}&body=${encodeURIComponent(body)}`;

    try {
      // Prefer a clickable link so browser handles the mailto navigation reliably.
      const a = document.createElement("a");
      a.href = href;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch {
      // Fallback for restrictive environments.
      window.location.href = href;
    }
  }

  const showNameError = touched.name && errors.name;
  const showEmailError = touched.email && errors.email;
  const showSubjectError = touched.subject && errors.subject;
  const showMessageError = touched.message && errors.message;

  return (
    <form onSubmit={onSubmit} noValidate className="min-w-0">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="font-athiti text-[26px] font-semibold leading-[1.22] text-neutral-900">
            Send a message
          </h2>
          <p className="font-poppins mt-1 text-sm leading-relaxed text-neutral-600">
            We’ll open a pre-filled email to <span className="font-medium text-neutral-800">{EMAIL_TO}</span>.
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="font-poppins block text-sm font-medium text-neutral-800">
            Name
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            value={values.name}
            onChange={(e) => onChange("name", e.target.value)}
            onBlur={() => onBlur("name")}
            aria-invalid={!!showNameError}
            aria-describedby={showNameError ? "contact-name-error" : undefined}
            className="mt-1 w-full rounded-lg border-2 border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 outline-none transition-[border-color,box-shadow] hover:border-neutral-300 focus:border-neutral-300"
          />
          {showNameError && (
            <p id="contact-name-error" className="mt-1 text-sm text-red-600">
              {showNameError}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="contact-email" className="font-poppins block text-sm font-medium text-neutral-800">
            Email
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={values.email}
            onChange={(e) => onChange("email", e.target.value)}
            onBlur={() => onBlur("email")}
            aria-invalid={!!showEmailError}
            aria-describedby={showEmailError ? "contact-email-error" : undefined}
            className="mt-1 w-full rounded-lg border-2 border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 outline-none transition-[border-color,box-shadow] hover:border-neutral-300 focus:border-neutral-300"
          />
          {showEmailError && (
            <p id="contact-email-error" className="mt-1 text-sm text-red-600">
              {showEmailError}
            </p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="contact-subject" className="font-poppins block text-sm font-medium text-neutral-800">
            Subject
          </label>
          <input
            id="contact-subject"
            name="subject"
            type="text"
            value={values.subject}
            onChange={(e) => onChange("subject", e.target.value)}
            onBlur={() => onBlur("subject")}
            aria-invalid={!!showSubjectError}
            aria-describedby={showSubjectError ? "contact-subject-error" : undefined}
            className="mt-1 w-full rounded-lg border-2 border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 outline-none transition-[border-color,box-shadow] hover:border-neutral-300 focus:border-neutral-300"
          />
          {showSubjectError && (
            <p id="contact-subject-error" className="mt-1 text-sm text-red-600">
              {showSubjectError}
            </p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="contact-message" className="font-poppins block text-sm font-medium text-neutral-800">
            Message
          </label>
          <textarea
            id="contact-message"
            name="message"
            rows={6}
            value={values.message}
            onChange={(e) => onChange("message", e.target.value)}
            onBlur={() => onBlur("message")}
            aria-invalid={!!showMessageError}
            aria-describedby={showMessageError ? "contact-message-error" : undefined}
            className="mt-1 w-full resize-y rounded-lg border-2 border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 outline-none transition-[border-color,box-shadow] hover:border-neutral-300 focus:border-neutral-300"
          />
          {showMessageError && (
            <p id="contact-message-error" className="mt-1 text-sm text-red-600">
              {showMessageError}
            </p>
          )}
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={!isValid}
          className="inline-flex w-full items-center justify-center rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white transition-[opacity,transform] hover:-translate-y-px active:translate-y-0 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          Open email draft
        </button>
        <a
          href={`mailto:${EMAIL_TO}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-neutral-700 underline-offset-4 hover:text-neutral-900 hover:underline"
        >
          Or email directly
        </a>
      </div>
    </form>
  );
}

