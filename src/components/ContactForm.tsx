"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  businessType: z.string().min(2, "Please tell us your business type"),
  message: z.string().min(10, "Please describe your goals (at least 10 characters)"),
});

type FormValues = z.infer<typeof schema>;

export default function ContactForm() {
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormValues) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Submission failed");
      toast.success("Proposal request sent! We'll be in touch within one business day.", {
        duration: 6000,
      });
      reset();
    } catch {
      toast.error("Something went wrong. Please try again or email hello@sitebrew.co");
    } finally {
      setSubmitting(false);
    }
  };

  const fieldClass =
    "w-full rounded-xl border border-[#1f2e8c]/20 bg-[#fffdf8] px-4 py-3 text-[#1a130e] outline-none focus:ring-2 focus:ring-[#1f2e8c]/30 disabled:opacity-50";
  const errorClass = "mt-1 text-xs text-red-500";

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div>
        <label htmlFor="name" className="sr-only">Your Name</label>
        <input
          {...register("name")}
          id="name"
          type="text"
          placeholder="Your Name"
          disabled={submitting}
          className={fieldClass}
        />
        {errors.name && <p className={errorClass}>{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="email" className="sr-only">Business Email</label>
        <input
          {...register("email")}
          id="email"
          type="email"
          placeholder="Business Email"
          disabled={submitting}
          className={fieldClass}
        />
        {errors.email && <p className={errorClass}>{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="businessType" className="sr-only">Business Type</label>
        <input
          {...register("businessType")}
          id="businessType"
          type="text"
          placeholder="Business Type (e.g. Restaurant, Salon, Plumber)"
          disabled={submitting}
          className={fieldClass}
        />
        {errors.businessType && (
          <p className={errorClass}>{errors.businessType.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="message" className="sr-only">Website and traffic goals</label>
        <textarea
          {...register("message")}
          id="message"
          rows={4}
          placeholder="What are your website and traffic goals?"
          disabled={submitting}
          className={fieldClass}
        />
        {errors.message && <p className={errorClass}>{errors.message.message}</p>}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-full bg-[#1f2e8c] px-6 py-3 font-semibold text-white transition hover:bg-[#152263] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Sending…" : "Request Proposal"}
      </button>
    </form>
  );
}
