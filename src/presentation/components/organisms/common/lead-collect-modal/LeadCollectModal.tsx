"use client";

import React, { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  RiArrowRightLine,
  RiArrowLeftLine,
  RiLoader4Line,
  RiTimeLine,
  RiPhoneLine,
  RiMailLine,
} from "@remixicon/react";
import { PHONE, BUSINESS_HOURS } from "@/constants/business-info";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/presentation/components/atoms/ui/dialog";
import { useLeadModal } from "@/hooks/use-lead-modal";
import { formatPhoneNumber } from "@/utils/phone-formatter";
import { submitLeadAction } from "@/server/actions/submit-lead.action";
import { z } from "zod";

// --------------------------------------------------------------------------
// Schema & Types
// --------------------------------------------------------------------------
const leadFormSchema = z
  .object({
    fullName: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must be less than 100 characters"),
    email: z.string().optional(),
    phone: z.string().optional(),
    preference: z.enum(["phone", "email"]),
    projectTypes: z.array(z.string()).min(1, "Please select at least one project type"),
    timelineStart: z.number().min(1, "Please select a timeline"),
    timelineEnd: z.number().min(1, "Please select a timeline"),
    contactTime: z.string().min(1, "Please select a preferred contact time"),
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
    if (data.timelineEnd < data.timelineStart) {
      ctx.addIssue({
        path: ["timelineEnd"],
        code: z.ZodIssueCode.custom,
        message: "End date must be after start date",
      });
    }
  });

const projectTypeOptions = [
  {
    value: "custom-cabinetry",
    label: "Custom Cabinetry",
    description: "Custom kitchens, bathroom vanities, and built-in storage tailored to your space.",
  },
  {
    value: "kitchen-remodel",
    label: "Kitchen Remodeling",
    description: "Full-service kitchen transformation with coordinated design and installation.",
  },
  {
    value: "bathroom-remodel",
    label: "Bathroom Remodeling",
    description: "Luxury vanities, tile work, and complete bathroom renovations.",
  },
  {
    value: "flooring-carpentry",
    label: "Flooring & Carpentry",
    description: "Hardwood, tile, custom closets, and architectural trim carpentry.",
  },
];

const contactTimeOptions = [
  { value: "morning", label: "Morning (8am-12pm)" },
  { value: "afternoon", label: "Afternoon (12pm-6pm)" },
  { value: "evening", label: "Evening (6pm-9pm)" },
];

type LeadFormValues = z.infer<typeof leadFormSchema>;

// --------------------------------------------------------------------------
// Component
// --------------------------------------------------------------------------
export const LeadCollectModal = () => {
  const { isOpen, closeModal } = useLeadModal();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    trigger,
    setValue,
    clearErrors,
    watch,
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
    mode: "onSubmit",
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      preference: "phone",
      projectTypes: [],
      timelineStart: 7,
      timelineEnd: 30,
      contactTime: "",
    },
  });

  const preference = watch("preference");
  const projectTypes = watch("projectTypes");
  const timelineStart = watch("timelineStart");
  const timelineEnd = watch("timelineEnd");

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
      setCurrentStep(1);
      setSubmitError(null);
    }, 300);
  }, [closeModal, reset, clearErrors]);

  const handleStep1Continue = async () => {
    setSubmitError(null);
    const isValid = await trigger(["fullName", preference === "phone" ? "phone" : "email"]);
    if (isValid) {
      setCurrentStep(2);
    }
  };

  const handleStep2Back = () => {
    setSubmitError(null);
    setCurrentStep(1);
  };

  const onSubmit = handleSubmit(async (data) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // If preference is phone and no email, use a placeholder
      const emailToSend = data.email || (preference === "phone" ? "noemail@placeholder.com" : "");

      // Prepare structured data object
      const structuredData = {
        projectTypes: data.projectTypes,
        timeline: {
          start: data.timelineStart,
          end: data.timelineEnd,
          label: `${data.timelineStart}-${data.timelineEnd} days`
        },
        contactTime: data.contactTime,
      };

      // Submit to backend
      const result = await submitLeadAction({
        name: data.fullName,
        email: emailToSend,
        phone: data.phone || "",
        message: `Project Types: ${data.projectTypes.join(", ")}\nTimeline: ${data.timelineStart}-${data.timelineEnd} days\nPreferred Contact Time: ${data.contactTime}`,
        source: "free-consultation-modal",
        data: structuredData,
      });

      if (result.success) {
        setCurrentStep(3);
      } else {
        // Show user-friendly error message
        const errorMessage = result.status === 404 
          ? "Service temporarily unavailable. Please try again later or call us directly."
          : "Failed to submit. Please try again.";
        setSubmitError(errorMessage);
      }
    } catch (error) {
      console.error("Error submitting lead:", error);
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
          Book Your Free Consultation
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
            {currentStep === 1 && (
              <h2 className="text-black text-2xl md:text-3xl font-medium font-hanken leading-7 tracking-wide uppercase">
                BOOK YOUR FREE CONSULTATION
              </h2>
            )}

            <AnimatePresence mode="wait">
              {currentStep === 3 ? (
                /* ------ Success State (Step 3) ------ */
                <motion.div
                  key="success"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="w-full flex-1 flex flex-col justify-start items-start gap-6 py-4"
                >
                  <h3 className="text-black text-2xl md:text-3xl font-bold font-hanken leading-tight uppercase">
                    SUCCESS! WE WILL BE REACHING OUT YOU SOON...
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
              ) : currentStep === 1 ? (
                /* ------ Step 1: Personal Info ------ */
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="w-full flex flex-col justify-start items-start gap-4"
                >
                  <div className="w-full flex flex-col justify-start items-start gap-3">
                    {/* Name Input */}
                    <div className="w-full flex flex-col gap-1">
                      <input
                        {...register("fullName")}
                        type="text"
                        placeholder="Your name"
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

                  {/* Continue Button */}
                  <button
                    type="button"
                    onClick={handleStep1Continue}
                    className="mt-2 self-stretch h-12 px-8 py-4 bg-[#403023] hover:bg-[#2C1F14] transition-colors text-white border-0 shadow-sm rounded-lg inline-flex justify-center items-center gap-4 w-full outline-none focus:ring-2 focus:ring-[#403023] focus:ring-offset-2"
                  >
                    <span className="text-center text-base font-medium font-rubik uppercase">
                      CONTINUE
                    </span>
                    <RiArrowRightLine className="size-5" />
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
                </motion.div>
              ) : (
                /* ------ Step 2: Preferences ------ */
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="w-full"
                >
                  <form
                    onSubmit={onSubmit}
                    className="w-full flex flex-col justify-start items-start gap-4"
                    noValidate
                  >
                    <div className="w-full flex flex-col justify-start items-start gap-4">
                      {/* Project Type Selection */}
                      <div className="w-full flex flex-col gap-2">
                        <label className="text-gray-700 text-sm font-medium font-rubik leading-5">
                          Project Type
                        </label>
                        <div className="w-full flex flex-col gap-2">
                          {projectTypeOptions.map((option) => {
                            const isSelected = projectTypes.includes(option.value);
                            return (
                              <div key={option.value} className="flex flex-col gap-1">
                                <label className="flex items-start gap-3 cursor-pointer group">
                                  <input
                                    type="checkbox"
                                    value={option.value}
                                    checked={isSelected}
                                    onChange={(e) => {
                                      const newTypes = e.target.checked
                                        ? [...projectTypes, option.value]
                                        : projectTypes.filter(t => t !== option.value);
                                      setValue("projectTypes", newTypes, { shouldValidate: true });
                                    }}
                                    className="w-4 h-4 mt-0.5 text-red-800 border-gray-300 rounded focus:ring-2 focus:ring-red-800 cursor-pointer"
                                  />
                                  <span className="text-sm font-rubik text-gray-700 group-hover:text-gray-900 flex-1">
                                    {option.label}
                                  </span>
                                </label>
                                {isSelected && (
                                  <div className="ml-7 p-2 bg-blue-50 border border-blue-200 rounded-md">
                                    <p className="text-xs font-rubik text-blue-800">
                                      {option.description}
                                    </p>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                        {errors.projectTypes && (
                          <span className="text-red-500 text-xs font-rubik mt-1">
                            {errors.projectTypes.message}
                          </span>
                        )}
                      </div>

                      {/* Timeline Selection */}
                      <div className="w-full flex flex-col gap-2">
                        <label className="text-gray-700 text-sm font-medium font-rubik leading-5">
                          Project Timeline (days)
                        </label>
                        <div className="flex items-center gap-3">
                          <div className="flex-1">
                            <input
                              type="number"
                              min="1"
                              max="365"
                              value={timelineStart}
                              onChange={(e) => setValue("timelineStart", parseInt(e.target.value) || 1, { shouldValidate: true })}
                              className="w-full h-10 px-3 py-2 bg-white rounded-md border border-gray-200 text-sm font-medium font-rubik focus:outline-none focus:ring-2 focus:ring-zinc-800"
                            />
                            <span className="text-xs text-gray-500 font-rubik mt-1 block">Start (days)</span>
                          </div>
                          <span className="text-gray-400">-</span>
                          <div className="flex-1">
                            <input
                              type="number"
                              min="1"
                              max="365"
                              value={timelineEnd}
                              onChange={(e) => setValue("timelineEnd", parseInt(e.target.value) || 1, { shouldValidate: true })}
                              className="w-full h-10 px-3 py-2 bg-white rounded-md border border-gray-200 text-sm font-medium font-rubik focus:outline-none focus:ring-2 focus:ring-zinc-800"
                            />
                            <span className="text-xs text-gray-500 font-rubik mt-1 block">End (days)</span>
                          </div>
                        </div>
                        {errors.timelineEnd && (
                          <span className="text-red-500 text-xs font-rubik mt-1">
                            {errors.timelineEnd.message}
                          </span>
                        )}
                      </div>

                      {/* Contact Time Selection */}
                      <div className="w-full flex flex-col gap-2">
                        <label className="text-gray-700 text-sm font-medium font-rubik leading-5">
                          Preferred Contact Time
                        </label>
                        <div className="w-full flex flex-col gap-2">
                          {contactTimeOptions.map((option) => (
                            <label
                              key={option.value}
                              className="flex items-center gap-3 cursor-pointer group"
                            >
                              <input
                                {...register("contactTime")}
                                type="radio"
                                value={option.value}
                                className="w-4 h-4 text-red-800 border-gray-300 focus:ring-2 focus:ring-red-800 cursor-pointer"
                              />
                              <span className="text-sm font-rubik text-gray-700 group-hover:text-gray-900">
                                {option.label}
                              </span>
                            </label>
                          ))}
                        </div>
                        {errors.contactTime && (
                          <span className="text-red-500 text-xs font-rubik mt-1">
                            {errors.contactTime.message}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Error Message */}
                    {submitError && (
                      <div className="w-full p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600 text-sm font-rubik">{submitError}</p>
                      </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="w-full flex gap-3 mt-2">
                      <button
                        type="button"
                        onClick={handleStep2Back}
                        className="flex-1 h-12 px-8 py-4 bg-white hover:bg-gray-50 transition-colors text-zinc-800 border border-gray-300 rounded-lg inline-flex justify-center items-center gap-4 outline-none focus:ring-2 focus:ring-zinc-800 focus:ring-offset-2"
                      >
                        <RiArrowLeftLine className="size-5" />
                        <span className="text-center text-base font-medium font-rubik uppercase">
                          BACK
                        </span>
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 h-12 px-8 py-4 bg-[#403023] hover:bg-[#2C1F14] transition-colors text-white border-0 shadow-sm rounded-lg inline-flex justify-center items-center gap-4 outline-none focus:ring-2 focus:ring-[#403023] focus:ring-offset-2 disabled:opacity-75"
                      >
                        {isSubmitting ? (
                          <RiLoader4Line className="size-5 animate-spin" />
                        ) : (
                          <>
                            <span className="text-center text-base font-medium font-rubik uppercase">
                              CONTINUE
                            </span>
                            <RiArrowRightLine className="size-5" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Area: Progress & Mockup */}
          <div className="flex-1 w-full bg-white rounded-sm inline-flex flex-col justify-start items-start gap-6 overflow-hidden min-w-80">
            <div className="w-full inline-flex justify-between items-center">
              <div className="flex justify-start items-center gap-3">
                {[
                  { step: 1, label: "CONTACT INFO" },
                  { step: 2, label: "PREFERENCES" },
                  { step: 3, label: "SUCCESS" },
                ].map(({ step, label }) => {
                  const isActive = currentStep === step;
                  const isCompleted = currentStep > step;
                  
                  return (
                    <div key={step} className="flex flex-col justify-start items-start gap-1">
                      <span
                        className={`text-xs md:text-sm font-rubik leading-5 whitespace-nowrap ${
                          isActive ? "text-black font-medium" : "text-gray-400 font-normal"
                        }`}
                      >
                        {label}
                      </span>
                      <div
                        className={`w-full h-1.5 rounded-[10px] transition-colors ${
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
