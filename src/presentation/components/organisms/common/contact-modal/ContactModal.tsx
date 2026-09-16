"use client";

import React, { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  RiArrowRightLine,
  RiLoader4Line,
  RiPhoneLine,
  RiMailLine,
  RiTimeLine,
} from "@remixicon/react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/presentation/components/atoms/ui/dialog";
import { useContactModal } from "@/hooks/use-contact-modal";
import { formatPhoneNumber } from "@/utils/phone-formatter";
import { submitLeadAction } from "@/server/actions/submit-lead.action";
import { z } from "zod";
import { PHONE, BUSINESS_HOURS } from "@/constants/business-info";

// --------------------------------------------------------------------------
// Schema & Types
// --------------------------------------------------------------------------
const contactFormSchema = z
  .object({
    fullName: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must be less than 100 characters"),
    email: z.string().optional(),
    phone: z.string().optional(),
    preference: z.enum(["phone", "email"]),
  })
  .superRefine((data, ctx) => {
    if (data.preference === "email" && (!data.email || !z.string().email().safeParse(data.email).success)) {
      ctx.addIssue({
        path: ["email"],
        code: z.ZodIssueCode.custom,
        message: "Please enter a valid email address",
      });
    }
    if (data.preference === "phone" && (!data.phone || data.phone.length < 7)) {
      ctx.addIssue({
        path: ["phone"],
        code: z.ZodIssueCode.custom,
        message: "Please enter a valid phone number",
      });
    }
  });

type ContactFormValues = z.infer<typeof contactFormSchema>;

// --------------------------------------------------------------------------
// Component
// --------------------------------------------------------------------------
export const ContactModal = () => {
  const { isOpen, closeModal } = useContactModal();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
    clearErrors,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    mode: "onSubmit",
    defaultValues: { 
      fullName: "", 
      email: "", 
      phone: "", 
      preference: "phone" 
    },
  });

  const preference = watch("preference");

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setValue("phone", formatted, { shouldValidate: true });
  };

  const handleClose = useCallback(() => {
    closeModal();
    // Reset after animation finishes
    setTimeout(() => {
      reset();
      clearErrors();
      setIsSuccess(false);
      setSubmitError(null);
    }, 300);
  }, [closeModal, reset, clearErrors]);

  const onSubmit = handleSubmit(async (data) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Simulate a brief delay for better UX
      await new Promise(resolve => setTimeout(resolve, 800));

      const message = `Contact Preference: ${preference === "phone" ? "Phone Call" : "Email"}`;

      // Submit to backend
      // If preference is phone and no email, use a placeholder
      const emailToSend = data.email || (preference === "phone" ? "noemail@placeholder.com" : "");
      
      const result = await submitLeadAction({
        name: data.fullName,
        email: emailToSend,
        phone: data.phone || "",
        message,
        source: "contact-us-modal",
      });

      if (result.success) {
        setIsSuccess(true);
      } else {
        // Show user-friendly error message
        const errorMessage = result.status === 404 
          ? "Service temporarily unavailable. Please try again later or call us directly."
          : "Failed to submit. Please try again.";
        setSubmitError(errorMessage);
      }
    } catch (error) {
      console.error("Error submitting contact:", error);
      setSubmitError("Service temporarily unavailable. Please try again later or call us directly.");
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        className="w-[calc(100%-2rem)] max-w-3xl p-5 pb-6 rounded-3xl outline outline-1 outline-offset-[-1px] outline-gray-200 border-none bg-white gap-0 shadow-2xl max-h-[90dvh] overflow-y-auto"
        aria-describedby={undefined}
      >
        <DialogTitle className="sr-only">
          Contact Us
        </DialogTitle>

        <div className="flex flex-col-reverse md:flex-row items-stretch justify-start w-full gap-8 md:gap-12">
          {/* Left Form / Success Area */}
          <div className="flex-1 flex flex-col justify-start md:justify-center items-start gap-8 min-w-72">
            {/* Logo */}
            <div className="w-40 h-10 relative shrink-0">
              <Image
                src="/images/mc-logo.svg"
                alt="Master Cabinets Logo"
                fill
                className="object-contain object-left"
                sizes="160px"
              />
            </div>

            {/* Heading */}
            {!isSuccess && (
              <h2 className="text-black text-2xl md:text-3xl font-medium font-hanken leading-7 tracking-wide uppercase">
                CONTACT US
              </h2>
            )}

            <AnimatePresence mode="wait">
              {isSuccess ? (
                /* ------ Success State ------ */
                <motion.div
                  key="success"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="w-full flex-1 flex flex-col justify-start items-start gap-6 py-4"
                >
                  <h3 className="text-black text-2xl md:text-3xl font-bold font-hanken leading-tight uppercase">
                    SUCCESS! WE WILL BE REACHING OUT TO YOU SOON...
                  </h3>
                  
                  <p className="text-gray-600 text-base font-rubik leading-6">
                    One of our consultants will reach out soon to talk about your project. Can't wait? Call us directly now
                  </p>
                  
                  <div className="flex items-center gap-2">
                    <RiTimeLine className="w-5 h-5 text-red-800" />
                    <span className="text-gray-600 text-sm font-rubik uppercase">
                      {BUSINESS_HOURS.footerDisplay}
                    </span>
                  </div>

                  <a
                    href={PHONE.href}
                    className="text-black text-3xl md:text-4xl font-bold font-rubik hover:text-red-800 transition-colors"
                  >
                    {PHONE.display}
                  </a>

                  <a
                    href={PHONE.href}
                    className="mt-2 w-full md:w-auto h-12 px-8 py-4 bg-[#403023] hover:bg-[#2C1F14] transition-colors text-white rounded-lg inline-flex justify-center items-center gap-4 text-base font-medium font-rubik uppercase"
                  >
                    CALL US NOW
                    <RiPhoneLine className="size-5" />
                  </a>
                  
                  <div className="text-gray-500 text-xs font-normal font-rubik leading-4 mt-2">
                    By submitting this form, you agree to our{" "}
                    <Link
                      href="/privacy-policy"
                      onClick={handleClose}
                      className="underline hover:text-gray-800 transition-colors"
                    >
                      Privacy Policy
                    </Link>
                    .
                  </div>
                </motion.div>
              ) : (
                /* ------ Form State ------ */
                <motion.form
                  key="form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  onSubmit={onSubmit}
                  className="w-full flex flex-col justify-start items-start gap-4"
                  noValidate
                >
                  <div className="w-full flex flex-col justify-start items-start gap-3">
                    {/* Name Input */}
                    <div className="w-full flex flex-col gap-1">
                      <input
                        {...register("fullName")}
                        type="text"
                        placeholder="Your name"
                        disabled={isSubmitting}
                        className={`w-full h-12 px-3 py-2 bg-white rounded-md border text-sm font-medium font-rubik placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-zinc-800 transition-colors ${errors.fullName ? "border-red-500" : "border-gray-200"}`}
                      />
                      {errors.fullName && (
                        <span className="text-red-500 text-xs font-rubik mt-1">
                          {errors.fullName.message}
                        </span>
                      )}
                    </div>

                    {/* Preference Label */}
                    <div className="text-gray-600 text-sm font-normal font-rubik leading-5 mt-2">
                      How do you prefer contact?
                    </div>

                    {/* Preference Toggle */}
                    <div className="w-full inline-flex justify-start items-start gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setValue("preference", "phone");
                          setValue("email", "");
                          clearErrors(["email", "phone"]);
                        }}
                        className={`flex-1 h-12 px-3 py-2 rounded-md border flex justify-center items-center gap-2.5 transition-all outline-none ${
                          preference === "phone"
                            ? "bg-zinc-800 border-zinc-800 text-white shadow-sm"
                            : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <RiPhoneLine
                          className={`size-4 opacity-80 ${preference === "phone" ? "text-white" : "text-gray-500"}`}
                        />
                        <span className="text-sm font-medium font-rubik leading-5 whitespace-nowrap">
                          By phone call
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setValue("preference", "email");
                          setValue("phone", "");
                          clearErrors(["email", "phone"]);
                        }}
                        className={`flex-1 h-12 px-3 py-2 rounded-md border flex justify-center items-center gap-2.5 transition-all outline-none ${
                          preference === "email"
                            ? "bg-zinc-800 border-zinc-800 text-white shadow-sm"
                            : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <RiMailLine
                          className={`size-4 opacity-80 ${preference === "email" ? "text-white" : "text-gray-500"}`}
                        />
                        <span className="text-sm font-medium font-rubik leading-5 whitespace-nowrap">
                          By e-mail
                        </span>
                      </button>
                    </div>

                    {/* Dynamic Contact Input */}
                    <div className="w-full flex flex-col gap-1 mt-1">
                      {preference === "phone" ? (
                        <>
                          <input
                            {...register("phone")}
                            type="tel"
                            placeholder="(000) 000-0000"
                            disabled={isSubmitting}
                            onChange={handlePhoneChange}
                            maxLength={14}
                            className={`w-full h-12 px-3 py-2 bg-white rounded-md border text-sm font-medium font-rubik placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-zinc-800 transition-colors ${errors.phone ? "border-red-500" : "border-gray-200"}`}
                          />
                          {errors.phone && (
                            <span className="text-red-500 text-xs font-rubik mt-1">
                              {errors.phone.message}
                            </span>
                          )}
                        </>
                      ) : (
                        <>
                          <input
                            {...register("email")}
                            type="email"
                            placeholder="Your email address"
                            disabled={isSubmitting}
                            className={`w-full h-12 px-3 py-2 bg-white rounded-md border text-sm font-medium font-rubik placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-zinc-800 transition-colors ${errors.email ? "border-red-500" : "border-gray-200"}`}
                          />
                          {errors.email && (
                            <span className="text-red-500 text-xs font-rubik mt-1">
                              {errors.email.message}
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Error Message */}
                  {submitError && (
                    <div className="w-full p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-600 text-sm font-rubik">{submitError}</p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-2 self-stretch h-12 px-8 py-4 bg-[#403023] hover:bg-[#2C1F14] transition-colors text-white border-0 shadow-sm rounded-lg inline-flex justify-center items-center gap-4 w-full outline-none focus:ring-2 focus:ring-[#403023] focus:ring-offset-2 disabled:opacity-75"
                  >
                    {isSubmitting ? (
                      <RiLoader4Line className="size-5 animate-spin" />
                    ) : (
                      <>
                        <span className="text-center text-base font-medium font-rubik uppercase">
                          CONTACT US NOW
                        </span>
                        <RiArrowRightLine className="size-5" />
                      </>
                    )}
                  </button>

                  <div className="text-gray-500 text-xs font-normal font-rubik leading-4 mt-2">
                    By submitting this form, you agree to our{" "}
                    <Link
                      href="/privacy-policy"
                      onClick={handleClose}
                      className="underline hover:text-gray-800 transition-colors"
                    >
                      Privacy Policy
                    </Link>
                    .
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* Right Area: Image & Progress */}
          <div className="flex-1 w-full bg-white rounded-sm inline-flex flex-col justify-start items-start gap-6 overflow-hidden min-w-80">
            {/* Progress Indicator */}
            <div className="w-full inline-flex justify-between items-center">
              <div className="flex justify-start items-center gap-3">
                {[
                  { step: 1, label: "CONTACT INFO" },
                  { step: 2, label: "SUCCESS" },
                ].map(({ step, label }) => {
                  const isActive = !isSuccess ? step === 1 : step === 2;
                  const isCompleted = isSuccess && step === 1;
                  
                  return (
                    <div key={step} className="flex-1 flex flex-col justify-start items-start gap-1">
                      <span
                        className={`text-xs md:text-sm font-rubik leading-5 whitespace-nowrap ${
                          isActive ? "text-black font-medium" : "text-gray-400 font-normal"
                        }`}
                      >
                        {label}
                      </span>
                      <div
                        className={`self-stretch h-1.5 rounded-[10px] transition-colors ${
                          isActive ? "bg-[#403023]" : isCompleted ? "bg-[#968272]" : "bg-[#E5DECD]"
                        }`}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mockup Image */}
            <div className="w-full flex-1 relative rounded-[10px] overflow-hidden min-h-[260px] md:min-h-[380px]">
              <Image
                src="/images/projects/gray-custom-kitchen-cabinetry.jpg"
                alt="Professional installation"
                fill
                sizes="(max-width: 768px) 100vw, 418px"
                className="object-cover"
                priority={false}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
