"use client";

import { useState } from "react";
import { Calculator, FlaskConical, Droplets, Syringe } from "lucide-react";

export default function PeptideCalculator() {
  const [peptideWeight, setPeptideWeight] = useState(""); // mg in vial
  const [bwVolume, setBwVolume] = useState(""); // mL of bacteriostatic water
  const [desiredDose, setDesiredDose] = useState(""); // mcg per dose

  const peptideMg = parseFloat(peptideWeight) || 0;
  const waterMl = parseFloat(bwVolume) || 0;
  const doseMcg = parseFloat(desiredDose) || 0;

  // Concentration = total mcg / total mL
  const concentrationMcgPerMl = waterMl > 0 ? (peptideMg * 1000) / waterMl : 0;

  // Volume per dose = desired dose / concentration
  const volumePerDose = concentrationMcgPerMl > 0 ? doseMcg / concentrationMcgPerMl : 0;

  // Number of doses per vial
  const dosesPerVial = doseMcg > 0 ? (peptideMg * 1000) / doseMcg : 0;

  // IU per dose (assuming 100 IU per mL on insulin syringe)
  const iuPerDose = volumePerDose * 100;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-cyan/30 bg-brand-cyan/5 text-brand-cyan text-xs font-medium mb-4">
          <Calculator className="w-3 h-3" />
          Research Tool
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Peptide Reconstitution Calculator</h1>
        <p className="text-brand-muted max-w-xl mx-auto">
          Calculate exact dosing volumes for your research peptides. Enter the peptide amount,
          reconstitution volume, and desired dose below.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Inputs */}
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-brand-cyan" />
            Input Parameters
          </h2>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Peptide Amount in Vial (mg)
            </label>
            <input
              type="number"
              value={peptideWeight}
              onChange={(e) => setPeptideWeight(e.target.value)}
              placeholder="e.g. 5"
              className="w-full px-4 py-3 bg-white border border-brand-border rounded-lg text-gray-900 placeholder-brand-muted text-sm focus:outline-none focus:border-brand-cyan/50 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Bacteriostatic Water Volume (mL)
            </label>
            <input
              type="number"
              value={bwVolume}
              onChange={(e) => setBwVolume(e.target.value)}
              placeholder="e.g. 2"
              className="w-full px-4 py-3 bg-white border border-brand-border rounded-lg text-gray-900 placeholder-brand-muted text-sm focus:outline-none focus:border-brand-cyan/50 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Desired Dose per Administration (mcg)
            </label>
            <input
              type="number"
              value={desiredDose}
              onChange={(e) => setDesiredDose(e.target.value)}
              placeholder="e.g. 250"
              className="w-full px-4 py-3 bg-white border border-brand-border rounded-lg text-gray-900 placeholder-brand-muted text-sm focus:outline-none focus:border-brand-cyan/50 transition-colors"
            />
          </div>

          {/* Quick presets */}
          <div>
            <p className="text-xs text-brand-muted mb-2">Quick Presets:</p>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "BPC-157 (5mg / 2mL / 250mcg)", p: "5", w: "2", d: "250" },
                { label: "TB-500 (5mg / 2mL / 2500mcg)", p: "5", w: "2", d: "2500" },
                { label: "Semaglutide (5mg / 3mL / 250mcg)", p: "5", w: "3", d: "250" },
                { label: "CJC-1295 (2mg / 2mL / 100mcg)", p: "2", w: "2", d: "100" },
              ].map(({ label, p, w, d }) => (
                <button
                  key={label}
                  onClick={() => {
                    setPeptideWeight(p);
                    setBwVolume(w);
                    setDesiredDose(d);
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs border border-brand-border text-brand-muted hover:border-brand-cyan hover:text-brand-cyan transition-colors"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Syringe className="w-5 h-5 text-brand-cyan" />
            Results
          </h2>

          <div className="space-y-4">
            <div className="p-5 rounded-xl border border-brand-border bg-blue-50/30">
              <div className="flex items-center gap-2 mb-1">
                <Droplets className="w-4 h-4 text-brand-cyan" />
                <p className="text-sm text-brand-muted">Concentration</p>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {concentrationMcgPerMl > 0 ? concentrationMcgPerMl.toFixed(1) : "—"}{" "}
                <span className="text-sm font-normal text-brand-muted">mcg/mL</span>
              </p>
            </div>

            <div className="p-5 rounded-xl border border-brand-border bg-blue-50/30">
              <div className="flex items-center gap-2 mb-1">
                <Syringe className="w-4 h-4 text-brand-cyan" />
                <p className="text-sm text-brand-muted">Volume Per Dose</p>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {volumePerDose > 0 ? volumePerDose.toFixed(3) : "—"}{" "}
                <span className="text-sm font-normal text-brand-muted">mL</span>
              </p>
              {iuPerDose > 0 && (
                <p className="text-sm text-brand-cyan mt-1">
                  = {iuPerDose.toFixed(1)} IU on insulin syringe (U-100)
                </p>
              )}
            </div>

            <div className="p-5 rounded-xl border border-brand-border bg-blue-50/30">
              <div className="flex items-center gap-2 mb-1">
                <FlaskConical className="w-4 h-4 text-brand-cyan" />
                <p className="text-sm text-brand-muted">Doses Per Vial</p>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {dosesPerVial > 0 ? Math.floor(dosesPerVial) : "—"}{" "}
                <span className="text-sm font-normal text-brand-muted">doses</span>
              </p>
            </div>
          </div>

          {/* Info box */}
          <div className="p-4 rounded-lg border border-brand-cyan/20 bg-brand-cyan/5">
            <p className="text-xs text-brand-muted leading-relaxed">
              <strong className="text-brand-cyan">How to use:</strong> Enter the total peptide weight
              in your vial, the amount of bacteriostatic water you&apos;ll add, and your desired dose
              per injection. The calculator shows you exactly how much liquid to draw for each dose.
              1 IU = 0.01mL on a U-100 insulin syringe.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/20">
            <p className="text-xs text-yellow-600">
              For research and educational purposes only. Consult qualified professionals for
              any research protocols.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
