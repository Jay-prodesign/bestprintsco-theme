# Exact Next Trigger

State: OWNER AUTHENTICATION REQUIRED

- Current system: Instagram authorization request opened from Meta Business Settings -> Best Prints Co. portfolio -> Instagram Accounts -> Add
- Exact blocker: Meta requires a direct account-holder confirmation on the button `bestprintsco_ olarak giriş yap`; the portfolio still shows no Instagram asset and no pending or sent claim request
- Correct owner: Gürkan Şenel
- Required owner action: in the newly opened Instagram authorization tab, click `bestprintsco_ olarak giriş yap` once; do not choose `Hesap Değiştir`
- Safe fallback: leave the tab open; no additional disconnect, portfolio claim, Page connection, Commerce connection, ad publication, or spend occurs
- Continuation trigger: if the authorization succeeds, owner reports that the tab closed or returned to Meta; if an error appears, leave the exact error screen open without retrying and report that it is visible
- Codex continuation cursor: refresh portfolio `913146750869963` Instagram Accounts, verify exact Instagram ID `17841401039012650`, reconnect Page `1153511934521436`, enable Inbox access, then attach Commerce Account `1995776851046152`
- Review condition: success requires the exact Instagram ID to appear in the BestPrintsCo portfolio; any password, 2FA, checkpoint, or identity request remains owner-only
- Historical-ad-account finding: restricted ad account `55495642` does not list Best Prints Co Page `1153511934521436` in its live Page assignments, so it is not currently proven to own or block this Instagram claim
- Terminal condition: Nstyled writes remain zero and live ad spend remains zero
