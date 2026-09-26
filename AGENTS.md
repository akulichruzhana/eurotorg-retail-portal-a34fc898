<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep the advertising catalogue sourced from `services.json` and `stores.json`, derived from the supplied documents, so all portal roles see one consistent list.
- Represent unpublished service prices as `null` throughout requests and totals; never invent a price or generate an invoice for an unpriced request.
