import {
  getCategoryReport,
  getPeriodReport,
  getSummaryReport,
} from "../../application/use-cases/reports/report-use-cases.js";
import { sendSuccess } from "../../shared/response.js";

export async function summary(req, res) {
  const report = await getSummaryReport(req.user.id, req.query);
  return sendSuccess(res, { data: report });
}

export async function byCategory(req, res) {
  const report = await getCategoryReport(req.user.id, req.query);
  return sendSuccess(res, { data: report });
}

export async function byPeriod(req, res) {
  const report = await getPeriodReport(req.user.id, req.query);
  return sendSuccess(res, { data: report });
}
