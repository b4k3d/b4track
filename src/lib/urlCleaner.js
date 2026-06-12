/**
 * B4TRACK URL Cleaner
 * Strips known tracking parameters from URLs
 * Logic inspired by https://github.com/zhanghai/Untracker
 */

const TRACKING_PARAMS = new Set([
  // UTM (Google Analytics)
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
  'utm_id', 'utm_source_platform', 'utm_creative_format', 'utm_marketing_tactic',

  // Google
  'gclid', 'gclsrc', 'gbraid', 'wbraid', '_ga', 'dclid',

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

  // Microsoft / Bing
  'msclkid',

  // HubSpot
  'hsa_acc', 'hsa_cam', 'hsa_grp', 'hsa_ad', 'hsa_src', 'hsa_tgt',
  'hsa_kw', 'hsa_mt', 'hsa_net', 'hsa_ver',
  '_hsenc', '_hsmi', 'hsCtaTracking',

  // Mailchimp
  'mc_cid', 'mc_eid',

  // Amazon
  'tag', 'ref_', 'pf_rd_p', 'pf_rd_r', 'pf_rd_s', 'pf_rd_t', 'pf_rd_i',
  'pd_rd_r', 'pd_rd_w', 'pd_rd_wg', 'qid', 'sprefix', 'sr', 'field-keywords',
  'ascsubtag',

  // YouTube
  'si', 'pp', 'feature', 'app',

  // Spotify
  'si',

  // General referral / tracking
  'ref', 'referrer', 'source', 'ref_src', 'ref_url',
  'clicked_item', 'icid', 'cmpid', 'cid', 'cmp',
  'affiliate_id', 'partner_id', 'promo', 'promo_code',
  'campaign_id', 'ad_id', 'adgroup_id', 'keyword_id',
  'placement', 'creative', 'network', 'device', 'matchtype',

  // Iterable
  '_ke',

  // Klaviyo
  'kme',

  // Drip
  '__s',

  // Marketo
  'mkt_tok',

  // Various analytics
  'at_medium', 'at_campaign', 'at_custom1', 'at_custom2', 'at_custom3', 'at_custom4',
  'at_emailtype', 'at_userid',
  'icid', 'actid', 'origin',
  's_kwcid', 'ef_id',
  'yclid',

  // Generic noise
  'zanpid', 'otc', 'ir_by', 'ir_campaignid',
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

export function cleanUrl(rawUrl) {
  let url = rawUrl.trim();

  // Add protocol if missing
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }

  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return rawUrl; // Return original if not a valid URL
  }

  const params = parsed.searchParams;
  const hostname = parsed.hostname.replace('www.', '');

  // Get domain-specific extra params to remove
  const domainParams = DOMAIN_RULES[hostname] || [];

  // Remove tracking params
  const toDelete = [];
  for (const [key] of params) {
    const lower = key.toLowerCase();
    if (TRACKING_PARAMS.has(lower) || domainParams.includes(lower)) {
      toDelete.push(key);
    }
  }
  toDelete.forEach((k) => params.delete(k));

  // Clean hash if it's a tracking hash (e.g. #ref=...)
  if (parsed.hash && parsed.hash.includes('=')) {
    const hashParams = new URLSearchParams(parsed.hash.slice(1));
    let hashDirty = false;
    for (const [key] of hashParams) {
      if (TRACKING_PARAMS.has(key.toLowerCase())) {
        hashParams.delete(key);
        hashDirty = true;
      }
    }
    if (hashDirty) {
      const newHash = hashParams.toString();
      parsed.hash = newHash ? '#' + newHash : '';
    }
  }

  // Handle redirect URLs (e.g. l.facebook.com/l.php?u=...)
  const redirectParam = params.get('u') || params.get('url') || params.get('q');
  if (redirectParam && isRedirectHost(hostname)) {
    try {
      const redirectUrl = new URL(decodeURIComponent(redirectParam));
      return cleanUrl(redirectUrl.toString());
    } catch {}
  }

  return parsed.toString();
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

export function extractUrls(text) {
  const urlRegex = /https?:\/\/[^\s"'<>]+/gi;
  return text.match(urlRegex) || [];
}

export function countRemovedParams(original, cleaned) {
  try {
    const orig = new URL(original.startsWith('http') ? original : 'https://' + original);
    const clean = new URL(cleaned.startsWith('http') ? cleaned : 'https://' + cleaned);
    return orig.searchParams.size - clean.searchParams.size;
  } catch {
    return 0;
  }
}