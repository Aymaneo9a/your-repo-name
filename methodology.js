export const PRODUCTS = {
  'Cloud SWG':         { cls: 'tag-swg',   color: '#185FA5', bg: '#E6F1FB', text: '#0C447C' },
  'ProxySG':           { cls: 'tag-proxy', color: '#534AB7', bg: '#EEEDFE', text: '#3C3489' },
  'Content Analysis':  { cls: 'tag-cas',   color: '#3B6D11', bg: '#EAF3DE', text: '#27500A' },
  'ZTNA':              { cls: 'tag-ztna',  color: '#854F0B', bg: '#FAEEDA', text: '#633806' },
  'Management Center': { cls: 'tag-mc',    color: '#993556', bg: '#FBEAF0', text: '#72243E' },
};

export const KB_URLS = {
  'Cloud SWG':         'https://techdocs.broadcom.com/us/en/symantec-security-software/web-and-network-security/cloud-swg/help.html',
  'ProxySG':           'https://techdocs.broadcom.com/us/en/symantec-security-software/web-and-network-security/edge-swg/7-3.html',
  'Content Analysis':  'https://techdocs.broadcom.com/us/en/symantec-security-software/web-and-network-security/content-analysis/3-0.html',
  'ZTNA':              'https://techdocs.broadcom.com/us/en/symantec-security-software/web-and-network-security/ztna/1-0.html',
  'Management Center': 'https://techdocs.broadcom.com/us/en/symantec-security-software/web-and-network-security/management-center/2-4.html',
};

export const RCA_TEMPLATES = {
  'ProxySG': {
    summary: 'SSL inspection is terminating traffic for categories marked as bypass due to a policy evaluation order change introduced in ProxySG 7.3.2.',
    rootCause: 'In ProxySG 7.3.2, the SSL interception policy evaluation order was modified. Bypass rules defined in the VPM are now evaluated after the global SSL intercept layer, causing bypassed destinations to still have their certificates inspected before the bypass rule is applied.',
    timeline: '00:00 — Upgrade to 7.3.2 completed\n00:05 — First SSL errors reported by users\n00:30 — Multiple users affected, IT escalation raised\n01:15 — Ticket created and logs collected',
    evidence: 'Access logs show CONNECT method for bypassed domains returning TUNNEL_DENIED. SSL intercept stats show 100% intercept rate including bypass categories. Event log: "ssl_intercept_bypass_order_change" warning present.',
    resolution: '1. Navigate to Configuration > SSL > SSL Interception\n2. Enable "Legacy bypass evaluation order" under Compatibility Settings\n3. Push updated policy from Management Center\n4. Verify with test user — bypass categories should resolve correctly\n5. Reference: Broadcom KB #189234 — SSL bypass order change in 7.3.2',
    kbRef: 'knowledge.broadcom.com/external/article/189234'
  },
  'Cloud SWG': {
    summary: 'WSS Agent is falling back to direct connection when off-network, bypassing all SWG policy enforcement due to Fail Open tunnel failure behavior.',
    rootCause: 'The Agent Traffic Manager (ATM) policy has "Fail Open" configured as the tunnel failure behavior. When off-network DNS resolution for the SWG endpoint fails or latency exceeds threshold, the agent routes traffic directly without enforcement.',
    timeline: '00:00 — User connects from home network\n00:01 — Agent fails to resolve SWG endpoint (split-DNS issue)\n00:02 — ATM fails open — traffic goes direct\n00:10 — Policy gap reported',
    evidence: 'Agent diagnostic logs show tunnel_connect_failed events followed by direct_route_fallback. ATM policy confirms fail_open=true. DNS query logs show no resolution for SWG endpoint from home networks.',
    resolution: '1. Log into Cloud SWG portal > Agent > Traffic Manager\n2. Change tunnel failure behavior from "Fail Open" to "Fail Closed"\n3. Alternatively: configure bypass domains for SWG endpoint to use public DNS\n4. Deploy updated ATM policy to all endpoints\n5. Test from off-network environment to confirm enforcement',
    kbRef: 'techdocs.broadcom.com/cloud-swg/atm-failover'
  },
  'ZTNA': {
    summary: 'ZTNA connector sessions dropping every 30 minutes due to default session lifetime enforcement introduced in the April 2026 platform update.',
    rootCause: 'The April 2026 ZTNA update enabled configurable session lifetime for segment applications with a default of 1800 seconds (30 minutes). Sessions terminate at this interval, forcing re-authentication.',
    timeline: '00:00 — ZTNA tenant updated April 2026\n00:30 — First session drop reported\n04:00 — Pattern confirmed: exactly 30-minute intervals\n24:00 — Recurring issue escalated, ticket raised',
    evidence: 'Connector event logs show session_timeout at 1800s intervals. ZTNA admin portal > Applications > Segment: session_lifetime=1800. Matches April 2026 release notes: "session lifetime enforced with default 1800s".',
    resolution: '1. Log into ZTNA Admin Portal\n2. Navigate to Applications > [affected segment application]\n3. Under Session Settings — increase lifetime or set to 0 for unlimited\n4. Enable "Extend session on activity" to reset timer on user actions\n5. Push updated application policy and monitor connector logs',
    kbRef: 'techdocs.broadcom.com/ztna/1-0/session-lifetime'
  },
  'Content Analysis': {
    summary: 'Content Analysis ICAP service stopped responding due to thread pool exhaustion from a spike in large archive file submissions.',
    rootCause: 'The VA service ran out of available scan threads due to a large archive file spike. Thread pool exhaustion caused new ICAP requests to time out, and the service entered a degraded state without automatic recovery.',
    timeline: '00:00 — Traffic spike with large archive files detected\n00:05 — VA thread pool saturated\n00:08 — ICAP service returns 503 errors\n00:15 — ProxySG reports ICAP unavailable\n00:20 — Ticket created',
    evidence: 'Content Analysis admin logs: "scan_thread_pool_exhausted" at 14:05. ICAP health endpoint returning HTTP 503. ProxySG access log: ICAP_SERVICE_UNAVAILABLE for all file-bearing requests.',
    resolution: '1. SSH to Content Analysis appliance\n2. Restart VA service: service content-analysis restart\n3. Verify ICAP response: curl -v icap://localhost:1344/av_scan\n4. Increase thread pool: Configuration > Performance > Scan Threads (recommend 32)\n5. Set max file size to prevent future queue exhaustion\n6. Configure ProxySG ICAP failover to secondary CAS node',
    kbRef: 'techdocs.broadcom.com/content-analysis/icap-config'
  },
  'Management Center': {
    summary: 'Policy sync failing on 2 of 4 ProxySG cluster nodes due to a firewall change blocking port 8082 between Management Center and affected appliances.',
    rootCause: 'A recent firewall rule update blocked port 8082 (MC sync port) to two ProxySG nodes. Management Center cannot establish the configuration sync channel to these nodes.',
    timeline: '00:00 — Firewall rule change deployed by network team\n00:00 — Port 8082 blocked to 2 ProxySG nodes\n01:00 — Policy push attempted from MC\n01:02 — Sync timeout on 2 nodes\n01:10 — Ticket raised',
    evidence: 'MC event log: "sync_timeout: 10.10.4.22, 10.10.4.23" on port 8082. Successful sync confirmed on .20 and .21. Network team confirms firewall policy blocked port 8082 to affected node subnet.',
    resolution: '1. Contact network team to restore port 8082 from MC to nodes 10.10.4.22 and 10.10.4.23\n2. Verify: telnet 10.10.4.22 8082 from MC server\n3. Retry policy push from Management Center\n4. Add port 8082 to firewall change review checklist going forward',
    kbRef: 'knowledge.broadcom.com/external/article/150987'
  }
};

export const DRAFT_TEMPLATES = {
  'ProxySG': `Dear {customer},

Thank you for contacting Broadcom Support regarding the SSL inspection issue following your ProxySG 7.3.2 upgrade.

After analyzing your logs, I have identified the root cause. Version 7.3.2 introduced a change to the SSL policy evaluation order — bypass rules are now evaluated after the global SSL intercept layer rather than before it, causing traffic to be inspected even for destinations that should be bypassed.

To resolve this immediately:
1. Navigate to Configuration > SSL > SSL Interception
2. Enable "Legacy bypass evaluation order" under Compatibility Settings
3. Push the updated policy from Management Center
4. Test access to confirm the issue is resolved

This is a configuration-only change with no restart or downtime required. Please apply it during a low-traffic window and confirm the result.

Kind regards`,

  'Cloud SWG': `Dear {customer},

Thank you for the detailed report on the off-network enforcement issue with your Cloud SWG deployment.

The root cause is the Agent Traffic Manager "Fail Open" setting. When remote users cannot reach the SWG tunnel endpoint due to home network DNS differences, the agent falls back to direct traffic routing rather than enforcing policy.

To fix this:
1. Log into Cloud SWG portal > Agent > Traffic Manager
2. Change tunnel failure behavior from "Fail Open" to "Fail Closed"
3. Deploy the updated ATM policy to your endpoint fleet
4. Test from an off-network device to confirm enforcement

Note: "Fail Closed" will block all internet access if the SWG tunnel is unreachable. If you prefer a less restrictive option, I can walk you through the bypass domain configuration as an alternative.

Please let me know how you would like to proceed.`,

  'ZTNA': `Dear {customer},

I understand the frustration — recurring session drops impacting your users daily is unacceptable and I have identified the root cause.

The April 2026 ZTNA update enabled session lifetime enforcement for segment applications, with a default of 1800 seconds (30 minutes). Your sessions are hitting this limit exactly on schedule.

To resolve immediately:
1. Log into the ZTNA Admin Portal
2. Go to Applications > [your affected segment application]
3. Under Session Settings, increase the session lifetime or enable "Extend session on activity" so the timer resets while users are active
4. Push the updated application policy

This takes under 5 minutes to apply with no downtime. I will remain available for any follow-up once you have applied the fix.`,

  'Content Analysis': `Dear {customer},

The ICAP service outage on your Content Analysis appliance was caused by scan thread pool exhaustion from a spike in large archive file submissions. The service entered a degraded state and did not auto-recover.

To restore service immediately:
1. SSH to the Content Analysis appliance
2. Run: service content-analysis restart
3. Verify: curl -v icap://localhost:1344/av_scan

To prevent recurrence:
- Increase scan threads: Configuration > Performance > Scan Threads (recommend 32)
- Set a maximum file size limit to cap queue load
- Configure a secondary CAS node as ICAP failover in ProxySG

Please apply the restart immediately to restore scanning. I will follow up to assist with the hardening steps.`,

  'Management Center': `Dear {customer},

I have identified the cause of the policy sync failure on 2 of your 4 ProxySG cluster nodes.

A recent firewall change on your network has blocked port 8082 between Management Center and the two affected appliances (10.10.4.22 and 10.10.4.23). The other two nodes are syncing successfully because they are on a different subnet not affected by this rule.

To resolve:
1. Ask your network team to restore port 8082 access from your MC server to 10.10.4.22 and 10.10.4.23
2. Verify connectivity once restored: telnet 10.10.4.22 8082 from the MC server
3. Retry the policy push from Management Center

This is a network-level change with no ProxySG or MC configuration required. Please coordinate with your network team and let me know once access is restored.`
};

export const INITIAL_TICKETS = [
  {
    id: 'TK-0041',
    subject: 'SSL inspection bypass — users unable to reach internal apps',
    product: 'ProxySG',
    status: 'open',
    sla: 'urgent',
    sentiment: 'frustrated',
    created: Date.now() - 7200000,
    customer: 'Ahmed Al-Rashidi',
    company: 'Gulf Bank',
    description: 'After upgrading to 7.3.2 users report they cannot access internal HTTPS apps. SSL inspection policy appears to be blocking traffic even for bypassed categories. Affects approximately 200 users across 3 offices.',
    conversation: [{ sender: 'customer', text: 'We upgraded last night and now half the office cannot access our internal banking portal. SSL errors everywhere. This is a critical production issue.', time: '09:14' }],
    logs: [],
    rca: false,
    firstReplyLogged: false,
    csatScore: null
  },
  {
    id: 'TK-0042',
    subject: 'Cloud SWG agent not enforcing policy off-network',
    product: 'Cloud SWG',
    status: 'open',
    sla: 'warning',
    sentiment: 'neutral',
    created: Date.now() - 3600000,
    customer: 'Sara Benali',
    company: 'Telecom Maroc',
    description: 'WSS agent installed on 200 endpoints. When users work from home the SWG policies do not apply. Traffic appears to go direct without enforcement.',
    conversation: [],
    logs: [],
    rca: false,
    firstReplyLogged: false,
    csatScore: null
  },
  {
    id: 'TK-0043',
    subject: 'ZTNA connector dropping sessions every 30 minutes',
    product: 'ZTNA',
    status: 'open',
    sla: 'warning',
    sentiment: 'frustrated',
    created: Date.now() - 5400000,
    customer: 'Youssef Chakir',
    company: 'OCP Group',
    description: 'Segment application sessions drop exactly every 30 minutes. Users must re-authenticate constantly. Connector logs show timeout errors at regular intervals.',
    conversation: [
      { sender: 'customer', text: 'This is the 3rd time this week. My users are complaining constantly. We need a fix urgently.', time: '08:30' },
      { sender: 'engineer', text: 'Thank you for reporting this. I am analyzing your connector logs now and will have an update shortly.', time: '08:45' }
    ],
    logs: [],
    rca: false,
    firstReplyLogged: true,
    csatScore: null
  },
  {
    id: 'TK-0044',
    subject: 'Content Analysis — ICAP service not responding',
    product: 'Content Analysis',
    status: 'open',
    sla: 'ok',
    sentiment: 'neutral',
    created: Date.now() - 1800000,
    customer: 'Nadia Tazi',
    company: 'Maroc Telecom',
    description: 'ProxySG is reporting ICAP service unavailable when sending files to Content Analysis for scanning. The VA service appears to have stopped responding.',
    conversation: [],
    logs: [],
    rca: false,
    firstReplyLogged: false,
    csatScore: null
  },
  {
    id: 'TK-0045',
    subject: 'Management Center policy push failing to ProxySG cluster',
    product: 'Management Center',
    status: 'open',
    sla: 'ok',
    sentiment: 'neutral',
    created: Date.now() - 900000,
    customer: 'Karim Idrissi',
    company: 'BMCE Bank',
    description: 'Policy push from MC 2.4 to a cluster of 4 ProxySG devices fails on 2 of the 4 nodes. Error message: configuration sync timeout.',
    conversation: [],
    logs: [],
    rca: false,
    firstReplyLogged: false,
    csatScore: null
  },
  {
    id: 'TK-0046',
    subject: 'Cloud SWG — authentication loop with Azure AD SAML',
    product: 'Cloud SWG',
    status: 'open',
    sla: 'ok',
    sentiment: 'escalating',
    created: Date.now() - 600000,
    customer: 'Fatima Ouahbi',
    company: 'CIH Bank',
    description: 'Users hitting authentication loop when Azure AD is configured as SAML IdP. Login page keeps redirecting. Affects approximately 30% of users.',
    conversation: [{ sender: 'customer', text: 'I have escalated this to my manager. We need resolution today or we will raise a P1 with Broadcom directly.', time: '10:05' }],
    logs: [],
    rca: false,
    firstReplyLogged: false,
    csatScore: null
  }
];

export const INTEL_SEED = [
  { icon: 'ti-refresh', color: '#185FA5', text: '<strong>Pattern match</strong> — ZTNA session drops match April 2026 known issue', time: '2m ago' },
  { icon: 'ti-alert-triangle', color: '#BA7517', text: '<strong>Sentiment alert</strong> — TK-0046 customer signals P1 escalation', time: '5m ago' },
  { icon: 'ti-book', color: '#1D9E75', text: '<strong>KB found</strong> — SSL bypass order change documented in ProxySG 7.3.2 release notes', time: '8m ago' },
  { icon: 'ti-alert-circle', color: '#A32D2D', text: '<strong>Knowledge gap</strong> — No docs loaded for Content Analysis v3.2', time: '12m ago' },
  { icon: 'ti-refresh', color: '#185FA5', text: '<strong>Pattern memory</strong> — ICAP thread exhaustion seen 3x this month', time: '18m ago' },
];
