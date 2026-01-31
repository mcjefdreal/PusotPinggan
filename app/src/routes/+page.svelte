<script>
    import logo from '../lib/icons/logomark.svg';
    import Signup from '../lib/components/sign-up.svelte';
    import Login from '../lib/components/log-in.svelte';
</script>

<div class="h-screen bg-linear-to-t from-pp-pink to-pp-light-pink flex flex-col justify-center items-center">
    <img src={logo} alt="Puso't Pinggan Logo" class="max-h-52"> 

    <h1 class="text-3xl text-pp-white font-semibold"> 
        Puso't Pinggan 
    </h1>

    <div class="grid place-items-center py-20 space-y-3">
        <a class="w-50 h-10 flex justify-center items-center rounded-lg border border-pp-white text-lg font-medium text-pp-white" href="#">
            Log In
        </a>

        <a class="w-50 h-10 flex justify-center items-center rounded-lg border border-pp-white bg-pp-white text-lg font-medium text-pp-pink" href="#">
            Sign Up
        </a>
    </div>

    <!-- <Signup> </Signup> -->
    <!-- <Login> </Login> -->
</div>