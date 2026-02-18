<script lang="ts">
    import { resolve } from '$app/paths'

    import { Label, Timepicker } from "flowbite-svelte";

    let selectedTimeRange = $state({ time: "00:00", endTime: "24:00" });

    function handleRangeChange(data: { time: string; endTime: string; [key: string]: string }): void {
        if (data) {
            selectedTimeRange = {
                time: data.time,
                endTime: data.endTime
            };
        }
    }
</script>

<div class="min-h-screen items-center justify-center">
    <div class="m-5">
        <form class="max-w-md">
            <div class="mb-6 grid gap-2 px-6">
                <div>
                    <label for="store_img" class="text-pp-gray mb-2.5 text-xs font-medium">Store image</label>
                    <input
                        type="file"
                        id="store_img"
                        required
                    />
                </div>

                <div>
                    <label for="store_name" class="text-pp-gray mb-2.5 text-xs font-medium">Store name</label>
                    <input
                        type="text"
                        id="store_name"
                        class="border-pp-gray w-full rounded-md border px-3 py-2.5 text-xs"
                        required
                    />
                </div>

                <div>
                    <label for="store_description" class="text-pp-gray mb-2.5 text-xs font-medium">Store description</label>
                    <textarea id="store_description" name="store_description" rows="4" class="w-full border-pp-gray w-full rounded-md border px-3 py-2.5 text-xs"></textarea>
                </div>

                <div>
                    <Label class="text-pp-gray mb-2.5 text-xs font-medium">Store hours</Label>
                    
                    <div class="flex flex-row items-center">
                        <Label class="pr-2"> Monday </Label>
                        <Timepicker type="range" onselect={handleRangeChange} value={selectedTimeRange.time} endValue={selectedTimeRange.endTime} divClass="shadow-none" />
                    </div>

                    <div class="flex flex-row items-center">
                        <Label class="pr-2"> Tuesday </Label>
                        <Timepicker type="range" onselect={handleRangeChange} value={selectedTimeRange.time} endValue={selectedTimeRange.endTime} divClass="shadow-none" />
                    </div>

                    <div class="flex flex-row items-center">
                        <Label class="pr-2"> Wednesday </Label>
                        <Timepicker type="range" onselect={handleRangeChange} value={selectedTimeRange.time} endValue={selectedTimeRange.endTime} divClass="shadow-none" />
                    </div>

                    <div class="flex flex-row items-center">
                        <Label class="pr-2"> Thursday </Label>
                        <Timepicker type="range" onselect={handleRangeChange} value={selectedTimeRange.time} endValue={selectedTimeRange.endTime} divClass="shadow-none" />
                    </div>

                    <div class="flex flex-row items-center">
                        <Label class="pr-2"> Friday </Label>
                        <Timepicker type="range" onselect={handleRangeChange} value={selectedTimeRange.time} endValue={selectedTimeRange.endTime} divClass="shadow-none" />
                    </div>

                    <div class="flex flex-row items-center">
                        <Label class="pr-2"> Saturday </Label>
                        <Timepicker type="range" onselect={handleRangeChange} value={selectedTimeRange.time} endValue={selectedTimeRange.endTime} divClass="shadow-none" />
                    </div>

                    <div class="flex flex-row items-center">
                        <Label class="pr-2"> Sunday </Label>
                        <Timepicker type="range" onselect={handleRangeChange} value={selectedTimeRange.time} endValue={selectedTimeRange.endTime} divClass="shadow-none" />
                    </div>
                </div>

                <div>
                    <label for="store_loc" class="text-pp-gray mb-2.5 text-xs font-medium">Location</label>
                    <input
                        type="text"
                        id="store_loc"
                        class="border-pp-gray w-full rounded-md border px-3 py-2.5 text-xs"
                        required
                    />
                </div>
            </div>
        </form>

        <div class="pr-2 pb-12">
            <button
                class="bg-pp-pink text-pp-white hover:bg-pp-darker-pink float-right rounded px-4 py-1 text-xs"
            >
                Create store
            </button>
        </div>
    </div>
</div>
