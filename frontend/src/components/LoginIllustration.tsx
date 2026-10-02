"use client";

import React from "react";

export default function LoginIllustration() {
  return (
    <div className="relative w-full max-w-[340px] sm:max-w-[380px] mx-auto flex items-center justify-center p-2 select-none">
      <svg
        viewBox="0 0 420 380"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto drop-shadow-sm"
      >
        {/* ============================================================== */}
        {/* 1. FLOATING PARTICLES & ACCENTS                                */}
        {/* ============================================================== */}
        {/* Mini Teal Triangle */}
        <polygon
          points="105,108 114,124 96,124"
          fill="#5EABA6"
          opacity="0.85"
          className="transition-transform duration-700 hover:scale-125"
        />

        {/* Mini Coral Triangle */}
        <polygon
          points="310,135 320,150 302,152"
          fill="#FB923C"
          opacity="0.75"
        />

        {/* Small Cross / Plus symbols */}
        <path
          d="M142 98V108M137 103H147"
          stroke="#94A3B8"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M285 102V112M280 107H290"
          stroke="#94A3B8"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M90 190V200M85 195H95"
          stroke="#CBD5E1"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Geometric Dots & Diamonds */}
        <circle cx="118" cy="192" r="3" fill="#5EABA6" opacity="0.6" />
        <circle cx="330" cy="180" r="3.5" fill="#38BDF8" opacity="0.7" />
        <circle cx="152" cy="72" r="2.5" fill="#F59E0B" opacity="0.6" />
        <circle cx="265" cy="80" r="3" fill="#5EABA6" opacity="0.6" />

        {/* Little energy / sound sparkle lines near meditating head */}
        <path
          d="M158 110L148 102"
          stroke="#2D3748"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M262 110L272 102"
          stroke="#2D3748"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* ============================================================== */}
        {/* 2. FLOATING MEDITATING CHARACTER (WITH GENTLE FLOAT ANIMATION) */}
        {/* ============================================================== */}
        <g className="animate-gentle-float origin-center">
          {/* Subtle soft shadow beneath meditating character */}
          <ellipse
            cx="210"
            cy="165"
            rx="36"
            ry="6"
            fill="#E2E8F0"
            opacity="0.6"
          />

          {/* Meditating Crossed Legs (Lotus Position / Loop) */}
          {/* Left loop leg */}
          <path
            d="M192 145 C176 142 168 152 182 156 C198 160 210 152 210 148"
            fill="#FFFFFF"
            stroke="#2D3748"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Right loop leg */}
          <path
            d="M228 145 C244 142 252 152 238 156 C222 160 210 152 210 148"
            fill="#FFFFFF"
            stroke="#2D3748"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Document Sheet Body with Folded Top-Right Corner */}
          <path
            d="M185 92 
               L224 92 
               L238 106 
               L238 142 
               C238 145 235 148 231 148 
               L189 148 
               C185 148 182 145 182 142 
               L182 96 
               C182 93 185 92 189 92 Z"
            fill="#FFFFFF"
            stroke="#2D3748"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Folded Top Corner Detail */}
          <path
            d="M224 92 L224 106 L238 106"
            fill="#F1F5F9"
            stroke="#2D3748"
            strokeWidth="2"
            strokeLinejoin="round"
          />

          {/* Happy Closed Smiling Eyes */}
          <path
            d="M195 116 Q199 110 203 116"
            stroke="#2D3748"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M217 116 Q221 110 225 116"
            stroke="#2D3748"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Sweet Cute Smile */}
          <path
            d="M206 123 Q210 128 214 123"
            stroke="#2D3748"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Gentle Blush Cheeks */}
          <circle cx="192" cy="122" r="3" fill="#FDA4AF" opacity="0.65" />
          <circle cx="228" cy="122" r="3" fill="#FDA4AF" opacity="0.65" />

          {/* Meditating Hands */}
          <path
            d="M182 126 C170 128 162 135 174 139"
            stroke="#2D3748"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M238 126 C250 128 258 135 246 139"
            stroke="#2D3748"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
        </g>

        {/* ============================================================== */}
        {/* 3. OFFICE CHAIR (BEHIND DESK)                                  */}
        {/* ============================================================== */}
        {/* Chair Backrest */}
        <rect
          x="146"
          y="180"
          width="48"
          height="54"
          rx="12"
          fill="#5EABA6"
          stroke="#2D3748"
          strokeWidth="2.5"
        />
        {/* Chair Seat */}
        <rect
          x="142"
          y="230"
          width="56"
          height="14"
          rx="6"
          fill="#489E9B"
          stroke="#2D3748"
          strokeWidth="2.5"
        />
        {/* Chair Stand / Pole */}
        <rect
          x="167"
          y="244"
          width="6"
          height="22"
          fill="#2D3748"
          stroke="#2D3748"
          strokeWidth="1.5"
        />
        {/* Chair Base Mechanism */}
        <rect
          x="163"
          y="266"
          width="14"
          height="6"
          rx="2"
          fill="#64748B"
          stroke="#2D3748"
          strokeWidth="2"
        />
        {/* Chair Legs & Wheels */}
        <path
          d="M170 269 L150 286"
          stroke="#2D3748"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M170 269 L190 286"
          stroke="#2D3748"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx="149" cy="287" r="3" fill="#2D3748" />
        <circle cx="191" cy="287" r="3" fill="#2D3748" />

        {/* ============================================================== */}
        {/* 4. WORK DESK (LEGS & DESKTOP)                                  */}
        {/* ============================================================== */}
        {/* Desk Left Leg Structure */}
        <rect
          x="132"
          y="238"
          width="10"
          height="50"
          fill="#D97706"
          stroke="#2D3748"
          strokeWidth="2.5"
        />
        <rect
          x="128"
          y="284"
          width="18"
          height="6"
          rx="2"
          fill="#B45309"
          stroke="#2D3748"
          strokeWidth="2"
        />

        {/* Desk Right Leg Structure */}
        <rect
          x="278"
          y="238"
          width="10"
          height="50"
          fill="#D97706"
          stroke="#2D3748"
          strokeWidth="2.5"
        />
        <rect
          x="274"
          y="284"
          width="18"
          height="6"
          rx="2"
          fill="#B45309"
          stroke="#2D3748"
          strokeWidth="2"
        />

        {/* Desk Cross Bar Support */}
        <rect
          x="138"
          y="248"
          width="144"
          height="4"
          fill="#F59E0B"
          stroke="#2D3748"
          strokeWidth="1.5"
        />

        {/* Desk Surface (Wooden Top) */}
        <rect
          x="100"
          y="226"
          width="220"
          height="14"
          rx="5"
          fill="#FBBF24"
          stroke="#2D3748"
          strokeWidth="2.5"
        />

        {/* ============================================================== */}
        {/* 5. ACCESSORIES ON THE DESK                                     */}
        {/* ============================================================== */}
        {/* Pink / Coral Coffee Mug on the left */}
        <g>
          {/* Mug Body */}
          <rect
            x="116"
            y="210"
            width="14"
            height="16"
            rx="3"
            fill="#FB7185"
            stroke="#2D3748"
            strokeWidth="2"
          />
          {/* Mug Handle */}
          <path
            d="M116 213 C110 213 110 223 116 223"
            stroke="#2D3748"
            strokeWidth="2"
            fill="none"
          />
        </g>

        {/* Laptop in Center of Desk */}
        <g>
          {/* Laptop Base */}
          <rect
            x="200"
            y="222"
            width="44"
            height="4"
            rx="1.5"
            fill="#CBD5E1"
            stroke="#2D3748"
            strokeWidth="2"
          />
          {/* Laptop Screen */}
          <rect
            x="203"
            y="190"
            width="38"
            height="32"
            rx="4"
            fill="#F8FAFC"
            stroke="#2D3748"
            strokeWidth="2.5"
          />
          {/* Apple/Logo Circle on Laptop back */}
          <circle cx="222" cy="206" r="3.5" fill="#94A3B8" />
        </g>

        {/* Pen Holder & Tools */}
        <g>
          {/* Slanted Blue Pencil / Pen */}
          <line
            x1="184"
            y1="202"
            x2="175"
            y2="226"
            stroke="#2D3748"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <line
            x1="183"
            y1="203"
            x2="176"
            y2="222"
            stroke="#38BDF8"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Slanted Cyan Ruler */}
          <rect
            x="264"
            y="194"
            width="8"
            height="32"
            rx="1.5"
            transform="rotate(35 264 194)"
            fill="#5EABA6"
            stroke="#2D3748"
            strokeWidth="2"
          />
          {/* Slanted Green Pen */}
          <line
            x1="248"
            y1="192"
            x2="258"
            y2="226"
            stroke="#2D3748"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <line
            x1="249"
            y1="193"
            x2="257"
            y2="223"
            stroke="#34D399"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </g>

        {/* Glowing Idea Lightbulb on the right */}
        <g className="animate-lightbulb-glow">
          {/* Lightbulb Glow Glass */}
          <circle
            cx="302"
            cy="196"
            r="12"
            fill="#38BDF8"
            stroke="#2D3748"
            strokeWidth="2.5"
          />
          {/* Lightbulb Base Screw */}
          <rect
            x="298"
            y="208"
            width="8"
            height="5"
            rx="1.5"
            fill="#CBD5E1"
            stroke="#2D3748"
            strokeWidth="2"
          />
          {/* Idea Ray Spikes */}
          <line x1="302" y1="178" x2="302" y2="173" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" />
          <line x1="316" y1="184" x2="320" y2="181" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" />
          <line x1="319" y1="198" x2="324" y2="199" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" />
        </g>

        {/* Briefcase / Bag on Floor Under Left Desk */}
        <g>
          {/* Briefcase Handle */}
          <path
            d="M120 262 C120 257 128 257 128 262"
            stroke="#2D3748"
            strokeWidth="2"
            fill="none"
          />
          {/* Briefcase Body */}
          <rect
            x="110"
            y="262"
            width="28"
            height="22"
            rx="3"
            fill="#EA580C"
            stroke="#2D3748"
            strokeWidth="2"
          />
          {/* Briefcase Buckle */}
          <rect
            x="122"
            y="268"
            width="4"
            height="5"
            rx="1"
            fill="#FEF08A"
            stroke="#2D3748"
            strokeWidth="1.5"
          />
        </g>

        {/* ============================================================== */}
        {/* 6. FLOOR DASHED GROUND LINE                                    */}
        {/* ============================================================== */}
        <line
          x1="60"
          y1="290"
          x2="95"
          y2="290"
          stroke="#94A3B8"
          strokeWidth="2.5"
          strokeDasharray="8 6"
          strokeLinecap="round"
        />
        <line
          x1="95"
          y1="290"
          x2="325"
          y2="290"
          stroke="#475569"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <line
          x1="325"
          y1="290"
          x2="360"
          y2="290"
          stroke="#94A3B8"
          strokeWidth="2.5"
          strokeDasharray="8 6"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
