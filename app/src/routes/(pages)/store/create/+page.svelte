<script lang="ts">
    import { resolve } from '$app/paths'
    import { enhance } from '$app/forms'

    import { Label, Timepicker } from "flowbite-svelte";

    // let selectedTimeRange = $state({ time: "00:00", endTime: "24:00" });

    // function handleRangeChange(data: { time: string; endTime: string; [key: string]: string }): void {
    //     if (data) {
    //         selectedTimeRange = {
    //             time: data.time,
    //             endTime: data.endTime
    //         };
    //     }
    // }

    let schedule = {
        monday: { open: '00:00', close: '00:00' },
        tuesday: { open: '00:00', close: '00:00' },
        wednesday: { open: '00:00', close: '00:00' },
        thursday: { open: '00:00', close: '00:00' },
        friday: { open: '00:00', close: '00:00' },
        saturday: { open: '00:00', close: '00:00' },
        sunday: { open: '00:00', close: '00:00' },
    }

    function handleRangeChange(day, start, end) {
        schedule[day] = { open: start, close: end};
    }

    let submitting = false;
</script>

<div class="min-h-screen items-center justify-center">
    <div class="m-5">
        <form method="POST" enctype="multipart/form-data" action="?/createStore" 
        use:enhance={() => {
            submitting = true;
            return async ({ update }) => {
            await update();
            submitting = false;
        };
    }} class="max-w-md">
            <div class="mb-6 grid gap-2 px-6">
                <div>
                    <label for="store_img" class="text-pp-gray mb-2.5 text-xs font-medium">Store image</label>
                    <input
                        type="file"
                        id="store_img"
                        name="store_img"
                        accept="image/*"
                        required
                    />
                </div>

                <div>
                    <label for="store_name" class="text-pp-gray mb-2.5 text-xs font-medium">Store name</label>
                    <input
                        type="text"
                        id="store_name"
                        name="store_name"
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

                    <input type="hidden" name="sched" value={JSON.stringify(schedule)} />
                    
                    <div class="flex flex-row items-center">
                        <Label class="pr-2"> Monday </Label>
                        <!-- <input type="hidden" name="mon_hrs" value={`${selectedTimeRange.time}-${selectedTimeRange.endTime}`}/>
                        <Timepicker type="range" onselect={handleRangeChange} value={selectedTimeRange.time} endValue={selectedTimeRange.endTime} divClass="shadow-none" /> -->
                        <Timepicker type="range" onselect={(e) => handleRangeChange('monday', e.time, e.endTime)} divClass="shadow-none" />
                    </div>

                    <div class="flex flex-row items-center">
                        <Label class="pr-2"> Tuesday </Label>
                        <!-- <input type="hidden" name="tue_hrs" value={`${selectedTimeRange.time}-${selectedTimeRange.endTime}`}/>
                        <Timepicker type="range" onselect={handleRangeChange} value={selectedTimeRange.time} endValue={selectedTimeRange.endTime} divClass="shadow-none" /> -->
                        <Timepicker type="range" onselect={(e) => handleRangeChange('monday', e.time, e.endTime)} divClass="shadow-none" />
                    </div>

                    <div class="flex flex-row items-center">
                        <Label class="pr-2"> Wednesday </Label>
                        <!-- <input type="hidden" name="wed_hrs" value={`${selectedTimeRange.time}-${selectedTimeRange.endTime}`}/>
                        <Timepicker type="range" onselect={handleRangeChange} value={selectedTimeRange.time} endValue={selectedTimeRange.endTime} divClass="shadow-none" /> -->
                        <Timepicker type="range" onselect={(e) => handleRangeChange('monday', e.time, e.endTime)} divClass="shadow-none" />
                    </div>

                    <div class="flex flex-row items-center">
                        <Label class="pr-2"> Thursday </Label>
                        <!-- <input type="hidden" name="thu_hrs" value={`${selectedTimeRange.time}-${selectedTimeRange.endTime}`}/>
                        <Timepicker type="range" onselect={handleRangeChange} value={selectedTimeRange.time} endValue={selectedTimeRange.endTime} divClass="shadow-none" /> -->
                        <Timepicker type="range" onselect={(e) => handleRangeChange('monday', e.time, e.endTime)} divClass="shadow-none" />
                    </div>

                    <div class="flex flex-row items-center">
                        <Label class="pr-2"> Friday </Label>
                        <!-- <input type="hidden" name="fri_hrs" value={`${selectedTimeRange.time}-${selectedTimeRange.endTime}`}/>
                        <Timepicker type="range" onselect={handleRangeChange} value={selectedTimeRange.time} endValue={selectedTimeRange.endTime} divClass="shadow-none" /> -->
                        <Timepicker type="range" onselect={(e) => handleRangeChange('monday', e.time, e.endTime)} divClass="shadow-none" />
                    </div>

                    <div class="flex flex-row items-center">
                        <Label class="pr-2"> Saturday </Label>
                        <!-- <input type="hidden" name="sat_hrs" value={`${selectedTimeRange.time}-${selectedTimeRange.endTime}`}/>
                        <Timepicker type="range" onselect={handleRangeChange} value={selectedTimeRange.time} endValue={selectedTimeRange.endTime} divClass="shadow-none" /> -->
                        <Timepicker type="range" onselect={(e) => handleRangeChange('monday', e.time, e.endTime)} divClass="shadow-none" />
                    </div>

                    <div class="flex flex-row items-center">
                        <Label class="pr-2"> Sunday </Label>
                        <!-- <input type="hidden" name="sun_hrs" value={`${selectedTimeRange.time}-${selectedTimeRange.endTime}`}/>
                        <Timepicker type="range" onselect={handleRangeChange} value={selectedTimeRange.time} endValue={selectedTimeRange.endTime} divClass="shadow-none" /> -->
                        <Timepicker type="range" onselect={(e) => handleRangeChange('monday', e.time, e.endTime)} divClass="shadow-none" />
                    </div>
                </div>

                <div>
                    <label for="store_loc" class="text-pp-gray mb-2.5 text-xs font-medium">Location</label>
                    <input
                        type="text"
                        id="store_loc"
                        name="store_loc"
                        class="border-pp-gray w-full rounded-md border px-3 py-2.5 text-xs"
                        required
                    />
                </div>
            </div>

            <div class="pr-2 pb-12">
                <button
                    type="submit"
                    disabled={submitting}
                    class="bg-pp-pink text-pp-white hover:bg-pp-darker-pink float-right rounded px-4 py-1 text-xs"
                >
                    {submitting ? 'Creating store...' : 'Create store'}
                </button>
            </div>
        </form>
    </div>
</div>
