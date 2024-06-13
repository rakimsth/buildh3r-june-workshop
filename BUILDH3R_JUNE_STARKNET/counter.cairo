#[starknet::interface]
trait ICounter<T> {
    fn get(self: @T) -> u32;
    fn increase_counter(ref self: T);
    fn decrease_counter(ref self: T);
}

#[starknet::contract]
mod Counter {
    use traits::Into;

    #[storage]
    struct Storage {
        value: u32,
    }

    #[constructor]
    fn constructor(ref self: ContractState, value_: u32) {
        self.value.write(value_);
    }

    #[abi(embed_v0)]
    impl Counter of super::ICounter<ContractState> {
        fn get(self: @ContractState) -> u32 {
            self.value.read()
        }
        fn increase_counter(ref self: ContractState)  {
            self.value.write( self.value.read() + 1 );
        }
        fn decrease_counter(ref self: ContractState)  {
            self.value.write( self.value.read() - 1 );
        }
    }
}