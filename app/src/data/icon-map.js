import {
  Target, Users, Lightbulb, AlertCircle, Eye,
  PenTool, HelpCircle, Sparkles, RefreshCw, Zap
} from "lucide-react";

const ICON_MAP = {
  Target, Users, Lightbulb, AlertCircle, Eye,
  PenTool, HelpCircle, Sparkles, RefreshCw, Zap
};

export function resolveIcon(name) {
  return ICON_MAP[name] || null;
}
