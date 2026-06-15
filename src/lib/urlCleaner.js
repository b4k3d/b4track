/**
 * B4TRACK URL Cleaner
 * Strips known tracking parameters from URLs
 * Logic inspired by https://github.com/zhanghai/Untracker
 */

export const TRACKING_PARAMS = new Set([
  // UTM (Google Analytics / Universal)
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
  'utm_id', 'utm_source_platform', 'utm_creative_format', 'utm_marketing_tactic',

  // Matomo / Piwik (mtm_ and pk_ variants)
  'mtm_campaign', 'mtm_source', 'mtm_medium', 'mtm_keyword', 'mtm_cid',
  'mtm_content', 'mtm_group', 'mtm_placement',
  'pk_campaign', 'pk_source', 'pk_medium', 'pk_keyword', 'pk_cid',
  'pk_content',

  // Google Ads / DoubleClick
  'gclid', 'gclsrc', 'gbraid', 'wbraid', '_ga', 'dclid', 'gad_source',

  // Google Shopping / Search
  'srsltid',

  // Facebook / Meta
  'fbclid', 'fb_action_ids', 'fb_action_types', 'fb_ref', 'fb_source',

  // Instagram
  'igshid', 'igsh',

  // Twitter / X
  'twclid', 'tw_source', 'tw_origin',

  // TikTok
  'ttclid', 'tt_medium', 'tt_content',

  // LinkedIn
  'li_fat_id', 'trk',

  // Pinterest
  'epik',

  // Microsoft / Bing Ads
  'msclkid',

  // Yahoo / Yandex
  'yclid',

  // HubSpot
  'hsa_acc', 'hsa_cam', 'hsa_grp', 'hsa_ad', 'hsa_src', 'hsa_tgt',
  'hsa_kw', 'hsa_mt', 'hsa_net', 'hsa_ver',
  '_hsenc', '_hsmi', 'hsctaTracking',

  // Mailchimp
  'mc_cid', 'mc_eid',

  // Marketo / LinkedIn
  'mkt_tok',

  // ConvertKit
  'ck_subscriber_id',

  // Vero
  'vero_id', 'vero_conv',

  // Iterable
  '_ke',

  // Klaviyo
  'kme',

  // Drip
  '__s',

  // Impact (affiliate)
  'irclickid', 'ir_by', 'ir_campaignid',

  // Branch.io
  'branch_match_id',

  // NCID (IBM / various)
  'ncid',

  // SharePoint / social
  'sr_share',

  // Amazon
  'tag', 'ref_', 'pf_rd_p', 'pf_rd_r', 'pf_rd_s', 'pf_rd_t', 'pf_rd_i',
  'pd_rd_r', 'pd_rd_w', 'pd_rd_wg', 'qid', 'sprefix', 'sr', 'field-keywords',
  'ascsubtag',

  // YouTube
  'si', 'pp', 'feature', 'app',

  // General referral / tracking
  'ref', 'referrer', 'source', 'ref_src', 'ref_url',
  'clicked_item', 'icid', 'cmpid', 'cid', 'cmp',
  'affiliate_id', 'partner_id', 'promo', 'promo_code',
  'campaign_id', 'ad_id', 'adgroup_id', 'keyword_id',
  'placement', 'creative', 'network', 'device', 'matchtype',

  // Various analytics
  'at_medium', 'at_campaign', 'at_custom1', 'at_custom2', 'at_custom3', 'at_custom4',
  'at_emailtype', 'at_userid',
  'actid', 'origin',
  's_kwcid', 'ef_id',

  // Generic noise / affiliate
  'zanpid', 'otc',
  'clickid', 'click_id', 'click_source',
  'affid', 'aff_id', 'aff_sub', 'aff_sub2', 'aff_click_id',

  // Shopify
  '_openstat', 'openstat',
]);

// Domain-specific rules
const DOMAIN_RULES = {
  'amazon.com': ['tag', 'ref_', 'pf_rd_p', 'pf_rd_r', 'pf_rd_s', 'pf_rd_t', 'pf_rd_i', 'pd_rd_r', 'pd_rd_w', 'pd_rd_wg', 'qid', 'sprefix', 'sr'],
  'amazon.co.uk': ['tag', 'ref_', 'pf_rd_p', 'pf_rd_r'],
  'amazon.de': ['tag', 'ref_', 'pf_rd_p', 'pf_rd_r'],
  'youtube.com': ['si', 'pp', 'feature', 'app'],
  'youtu.be': ['si', 'pp', 'feature'],
  'open.spotify.com': ['si'],
  'twitter.com': ['s', 'src'],
  'x.com': ['s', 'src'],
  'reddit.com': ['utm_source', 'utm_medium', 'utm_name', 'utm_content', 'utm_term', 'ref_source', 'ref_campaign'],
};

// Prefixes to strip in aggressive mode (any param starting with these)
const AGGRESSIVE_PREFIXES = [
  'utm_', 'mtm_', 'pk_', 'hsa_', '_hs',
  'gclid', 'gbraid', 'wbraid', 'gad_',
];

function isAggressiveMatch(key) {
  const lower = key.toLowerCase();
  return AGGRESSIVE_PREFIXES.some((prefix) => lower.startsWith(prefix));
}

/**
 * Clean a URL and return both the cleaned URL and list of removed param names.
 */
export function cleanUrlDetailed(rawUrl, aggressive = false) {
  let url = rawUrl.trim();
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }

  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return { cleaned: rawUrl, removed: [] };
  }

  const params = parsed.searchParams;
  const hostname = parsed.hostname.replace('www.', '');
  const domainParams = DOMAIN_RULES[hostname] || [];

  const removed = [];
  const toDelete = [];
  for (const [key] of params) {
    const lower = key.toLowerCase();
    if (TRACKING_PARAMS.has(lower) || domainParams.includes(lower) || (aggressive && isAggressiveMatch(key))) {
      toDelete.push(key);
      removed.push(key);
    }
  }
  toDelete.forEach((k) => params.delete(k));

  // Clean tracking hash params
  if (parsed.hash && parsed.hash.includes('=')) {
    const hashParams = new URLSearchParams(parsed.hash.slice(1));
    let hashDirty = false;
    for (const [key] of hashParams) {
      if (TRACKING_PARAMS.has(key.toLowerCase())) {
        hashParams.delete(key);
        removed.push(key);
        hashDirty = true;
      }
    }
    if (hashDirty) {
      const newHash = hashParams.toString();
      parsed.hash = newHash ? '#' + newHash : '';
    }
  }

  // Unwrap redirect URLs
  const redirectParam = params.get('u') || params.get('url') || params.get('q');
  if (redirectParam && isRedirectHost(hostname)) {
    try {
      const redirectUrl = new URL(decodeURIComponent(redirectParam));
      const inner = cleanUrlDetailed(redirectUrl.toString());
      return { cleaned: inner.cleaned, removed: [...removed, ...inner.removed] };
    } catch {}
  }

  return { cleaned: parsed.toString(), removed };
}

/** Simple wrapper that just returns the cleaned URL string. */
export function cleanUrl(rawUrl, aggressive = false) {
  return cleanUrlDetailed(rawUrl, aggressive).cleaned;
}

export function extractUrls(text) {
  const urlRegex = /https?:\/\/[^\s"'<>]+/gi;
  return text.match(urlRegex) || [];
}

function isRedirectHost(hostname) {
  const redirectHosts = [
    'l.facebook.com', 'lm.facebook.com', 'out.reddit.com',
    't.co', 'bit.ly', 'ow.ly', 'buff.ly',
    'redirect.viglink.com', 'go.redirectingat.com',
    'click.linksynergy.com',
  ];
  return redirectHosts.some((h) => hostname.includes(h));
}