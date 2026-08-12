/**
 * Single dayjs setup — imported everywhere instead of raw "dayjs".
 * --------------------------------------------------------------
 * Extends dayjs with the plugins the create-post wizard needs:
 *
 *   customParseFormat  → lets dayjs parse non-ISO strings like
 *                        "10 Aug 2026, 04:04 AM" (the format used
 *                        by the antd RangePicker in Stagetwo.jsx).
 *                        Without this, antd's internal re-parse of
 *                        the formatted value returns Invalid Date.
 *
 *   utc                → .utc() / .toISOString() helpers used when
 *                        sending scheduleRange to the API.
 *
 * Only ONE copy of dayjs exists in the tree (pinned in package.json
 * and deduped by npm), so extending it here also extends the instance
 * antd's @rc-component/picker uses internally — no dual-copy gap.
 * --------------------------------------------------------------
 */
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

export default dayjs;