<script lang="ts">
  const store = {
    name: 'Manam',
    pending: 2,
    ongoing: 1,
    img_url: 'https://placehold.co/96x96'
  };
</script>

<div class="border-b border-pp-gray/30 px-4 py-4 bg-white">
  <div class="flex gap-3">
    <img class="h-20 w-20 rounded-xl object-cover" src={store.img_url} alt="Store image" />
    <div class="flex-1">
      <div class="text-xl font-semibold text-pp-pink">{store.name}</div>
      <div class="mt-1 text-xs text-pp-gray">Pending Orders: {store.pending}</div>
      <div class="text-xs text-pp-gray">Ongoing Orders: {store.ongoing}</div>
      <button class="mt-2 rounded-full bg-pp-pink px-4 py-1 text-xs text-pp-white">
        View Orders
      </button>
    </div>
  </div>
</div>

<!-- Figma has empty space below -->
<div class="min-h-[520px] bg-white"></div>