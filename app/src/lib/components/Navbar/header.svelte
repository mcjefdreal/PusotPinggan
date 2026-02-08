<script>
    import logo from '../../icons/logomark.svg';

    import { Search, Button, Dropdown, DropdownItem } from "flowbite-svelte";
    import { SearchOutline, AdjustmentsHorizontalOutline, MapPinAltOutline, CogSolid } from "flowbite-svelte-icons";

    const items = [
        {
        label: "Filter 1"
        },
        {
        label: "Filter 2"
        },
        {
        label: "Filter 3"
        },
        {
        label: "Filter 4"
        },
        {
        label: "Filter 5"
        }
    ];

    let selectCategory = $state("Filters");
</script>

<nav class="from-pp-pink to-pp-light-pink bg-linear-to-t fixed w-full z-20 top-0 start-0 p-2 pb-4">
    <div class="max-w-screen-xl flex items-center p-4">
        <MapPinAltOutline class="shrink-0 h-8 w-8 text-pp-white" />
        <div class="ml-4 flex flex-col items-left">
            <p class="text-pp-white font-bold"> P. Velazquez St. </p>
            <p class="text-pp-white"> Diliman, Quezon City </p>
        </div>
        <CogSolid class="shrink-0 h-8 w-8 text-pp-white ml-auto" />
    </div>

    <form class="max-w-screen-xl flex px-4">
        <div class="relative w-full">
            <div class="absolute inset-y-0 start-0 flex items-center ps-3">
                <SearchOutline class="ms-0.5 h-6 w-6 text-pp-gray" />
            </div>
            <input type="search" id="search" class="p-3 ps-10 w-full bg-pp-white border border-pp-gray text-sm rounded-lg placeholder:text-body placeholder:text-pp-gray" placeholder="Search for food" />
        </div>

        <div class="relative px-8 ml-4 bg-pp-white rounded-lg border border-pp-gray">
            <Button class="flex text-pp-gray">
            {selectCategory}
            <AdjustmentsHorizontalOutline class="ms-2.5 h-6 w-6" />
            </Button>
            <Dropdown simple class="w-40">
            {#each items as { label } (label)}
                <DropdownItem
                onclick={() => {
                    selectCategory = label;
                }}
                class={selectCategory === label ? "underline" : ""}
                >
                {label}
                </DropdownItem>
            {/each}
            </Dropdown>
        </div>
    </form>
</nav>
