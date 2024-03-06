




export class DefaultSingleton {
    private static instance: DefaultSingleton;
    public static getInstance(): DefaultSingleton {
        if (!DefaultSingleton.instance) {
            DefaultSingleton.instance = new DefaultSingleton();
        }
        return DefaultSingleton.instance;
    }



}