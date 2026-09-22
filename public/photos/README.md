# Photos

To swap a placeholder for a real photograph:

1. Add the image as `<place-id>.jpg` in this folder — e.g. `brussels-atomium.jpg`
   for the place with `id: 'brussels-atomium'` in `src/data/locations.ts`.
2. In that place's entry in `locations.ts`, set `photo.hasRealImage: true`.

That's it — the card will render the photo instead of the placeholder
gradient automatically. Portraits for the twelve people work the same way
once that's wired up in `PeopleView.tsx` (currently initials-only).

Keep images reasonably compressed (long edge ~1600px, JPEG ~75–85% quality)
so the site stays fast — nothing here is optimized automatically yet.
