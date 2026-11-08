"use client";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { useQuestionnaireConfig } from "@/hooks/use-questionnaire-config";
import { usePreferences } from "@/hooks/use-preferences";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CategoryManager } from "./CategoryManager";
import { QuestionsManager } from "./QuestionsManager";
import { ConfigImportExport } from "./ConfigImportExport";
import { SettingsPanel } from "./SettingsPanel";

export function Workspace() {
  const { config, setConfig, resetConfig, isCustom, ready } = useQuestionnaireConfig();
  const { prefs, setPrefs } = usePreferences();

  if (!ready || !config) return <Skeleton className="h-[480px]" />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold tracking-tight text-navy sm:text-3xl">Configuration workspace</h1>
            <Badge variant={isCustom ? "accent" : "outline"}>{isCustom ? "Customised" : "Default"}</Badge>
          </div>
          <p className="max-w-2xl text-sm text-slate">Manage categories, questions and conditional rules for the questionnaire on this device. Changes apply immediately to the customer view.</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/questionnaire/">
            Preview questionnaire <ExternalLink />
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="questions">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="questions">Questions</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="importexport">Import / Export</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="questions">
          <QuestionsManager config={config} onChange={setConfig} />
        </TabsContent>
        <TabsContent value="categories">
          <CategoryManager config={config} onChange={setConfig} />
        </TabsContent>
        <TabsContent value="importexport">
          <ConfigImportExport config={config} isCustom={isCustom} onImport={setConfig} onReset={resetConfig} />
        </TabsContent>
        <TabsContent value="settings">
          <SettingsPanel prefs={prefs} onSave={setPrefs} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
