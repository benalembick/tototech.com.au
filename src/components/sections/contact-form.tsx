"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { contactSchema, type ContactFormValues } from "@/lib/validations/contact";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (values: ContactFormValues) => {
    setStatus("idle");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      reset();
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center rounded-2xl border border-electric-400/20 bg-electric-500/5 px-8 py-16 text-center"
      >
        <CheckCircle2 className="h-12 w-12 text-electric-500" strokeWidth={1.5} />
        <h3 className="mt-5 font-display text-xl font-bold text-navy-900">
          Thank you — your message has been sent.
        </h3>
        <p className="mt-2 max-w-sm text-[15px] text-navy-900/55">
          A member of our team will be in touch within one business day.
        </p>
        <Button variant="outline" className="mt-6" onClick={() => setStatus("idle")}>
          Send another message
        </Button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" placeholder="Jane Smith" {...register("name")} />
          {errors.name && (
            <p className="text-[13px] text-red-600">{errors.name.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="jane@organisation.com.au" {...register("email")} />
          {errors.email && (
            <p className="text-[13px] text-red-600">{errors.email.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="company">Company</Label>
          <Input id="company" placeholder="Organisation name" {...register("company")} />
          {errors.company && (
            <p className="text-[13px] text-red-600">{errors.company.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone (optional)</Label>
          <Input id="phone" type="tel" placeholder="+61 4XX XXX XXX" {...register("phone")} />
          {errors.phone && (
            <p className="text-[13px] text-red-600">{errors.phone.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          placeholder="Tell us about your organisation and what you're looking to achieve."
          {...register("message")}
        />
        {errors.message && (
          <p className="text-[13px] text-red-600">{errors.message.message}</p>
        )}
      </div>

      {status === "error" && (
        <p className="text-[14px] text-red-600">
          Something went wrong sending your message. Please try again or email us directly.
        </p>
      )}

      <Button type="submit" size="lg" disabled={isSubmitting} className="w-full sm:w-auto">
        {isSubmitting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
        Send Message
      </Button>
    </form>
  );
}
