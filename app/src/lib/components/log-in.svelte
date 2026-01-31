<script>
    import logo from '../icons/logomark.svg';
</script>

<div class="flex flex-col justify-center items-center">
    <img src={logo} alt="Puso't Pinggan Logo" class="max-h-36"> 

    <div class="bg-pp-white w-80 rounded-xl m-6">
        <p class="text-center text-pp-pink pt-5 pb-3 font-medium text-3xl"> Welcome back! </p>

        <form>
            <div class="grid gap-2 mb-6 px-6">
                <div>
                    <label for="phone" class="mb-2.5 text-xs font-medium text-pp-gray">Phone number</label>
                    <input type="tel" id="phone" class="border border-pp-gray text-xs rounded-md w-full px-3 py-2.5" placeholder="0912 345 6789" pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}" required />
                </div>

                <div>
                    <label for="password" class="mb-2.5 text-xs font-medium text-pp-gray">Password</label>
                    <input type="password" id="password" class="border border-pp-gray text-xs rounded-md w-full px-3 py-2.5" placeholder="•••••••••" required />
                </div> 
            </div>
        </form>

        <div class="pb-12 pr-6">
            <button class="bg-pp-pink text-pp-white text-xs py-1 px-4 rounded float-right">
                Log in
            </button>
        </div>

        <p class="text-xs text-pp-gray px-6 pb-8"> Don't have an account? Sign up <a class="text-pp-pink underline" href="#"> here! </a> </p>

    </div>
</div>

