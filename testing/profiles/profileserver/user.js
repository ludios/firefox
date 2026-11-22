/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// Preferences file for profileserver.
/* globals user_pref */
// Turn off budget throttling for the profile server
user_pref("dom.timeout.enable_budget_timer_throttling", false);
// Turn off update
user_pref("app.update.disabledForTesting", true);
// Don't break the add-ons in build/pgo/addons when they use deprecated APIs
user_pref("extensions.webextensions.warnings-as-errors", false);
// Refuse Dark Reader's install-time help page and news feed by resolving their
// host to localhost, where nothing serves HTTPS
user_pref("network.dns.localDomains", "darkreader.org");
// Don't use the build machine's system proxy settings or PAC file
user_pref("network.proxy.type", 0);

// Train with the prefs of the profile that this build is used with, so that
// the code paths those prefs pick get the profile data.
user_pref("accessibility.force_disabled", 1);
user_pref("apz.record_checkerboarding", false);
user_pref("browser.safebrowsing.malware.enabled", false);
user_pref("browser.safebrowsing.phishing.enabled", false);
user_pref("font.default.x-unicode", "sans-serif");
user_pref("font.default.x-western", "sans-serif");
user_pref("font.name.monospace.ja", "UD Digi Kyokasho N-R");
user_pref("font.name.monospace.x-unicode", "PragmataPro Mono");
user_pref("font.name.monospace.x-western", "PragmataPro Mono");
user_pref("font.name.sans-serif.ja", "UD Digi Kyokasho NK-R");
user_pref("font.name.sans-serif.x-unicode", "Inter Display");
user_pref("font.name.sans-serif.x-western", "Inter Display");
user_pref("font.name.serif.ja", "UD Digi Kyokasho NK-R");
user_pref("font.name.serif.x-unicode", "Inter Display");
user_pref("font.name.serif.x-western", "Inter Display");
user_pref("font.size.monospace.x-unicode", 14);
user_pref("font.size.monospace.x-western", 14);
user_pref("layout.css.system-ui.enabled", false);
user_pref("media.eme.enabled", false);
user_pref("network.dns.disablePrefetch", true);
user_pref("network.prefetch-next", false);
user_pref("privacy.timezone_override", "America/Los_Angeles");
user_pref("security.enterprise_roots.enabled", false);
// Load build/pgo/userContent.css, which profileserver.py puts in the profile.
user_pref("toolkit.legacyUserProfileCustomizations.stylesheets", true);
user_pref("ui.prefersReducedMotion", 1);
