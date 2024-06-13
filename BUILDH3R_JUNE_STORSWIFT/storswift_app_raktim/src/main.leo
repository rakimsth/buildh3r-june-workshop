// The 'storswift_app_raktim' program.
program storswift_app_raktim.aleo {
    transition main(public a: u32, b: u32) -> u32 {
        let c: u32 = a + b;
        return c;
    }
}
