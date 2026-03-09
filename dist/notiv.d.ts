import { Component } from 'vue';
import { VNode } from 'vue';

export declare const notiv: {
    show(opts: NotivOptions): string;
    success(opts: NotivOptions): string;
    error(opts: NotivOptions): string;
    warning(opts: NotivOptions): string;
    info(opts: NotivOptions): string;
    action(opts: NotivOptions): string;
    loading(opts: NotivOptions): string;
    promise<T>(promise: Promise<T> | (() => Promise<T>), opts: NotivPromiseOptions<T>): Promise<T>;
    dismiss(id: string): void;
    clear(position?: NotivPosition): void;
};

declare const NOTIV_POSITIONS: readonly ["top-left", "top-center", "top-right", "bottom-left", "bottom-center", "bottom-right"];

declare interface NotivButton {
    title: string;
    onClick: () => void;
}

declare interface NotivOptions {
    id?: string;
    title?: string;
    description?: string;
    type?: NotivState;
    position?: NotivPosition;
    /** Duration in ms. null = persist forever. */
    duration?: number | null;
    icon?: Component | VNode | null;
    styles?: NotivStyles;
    fill?: string;
    roundness?: number;
    /** Auto expand/collapse. Defaults to true. false = disabled, object = custom delays (ms) */
    autopilot?: boolean | {
        expand?: number;
        collapse?: number;
    };
    button?: NotivButton;
}

declare type NotivPosition = (typeof NOTIV_POSITIONS)[number];

export declare interface NotivPromiseOptions<T = unknown> {
    loading: NotivOptions;
    success: NotivOptions | ((data: T) => NotivOptions);
    error: NotivOptions | ((err: unknown) => NotivOptions);
    position?: NotivPosition;
}

declare type NotivState = 'success' | 'loading' | 'error' | 'warning' | 'info' | 'action';

declare interface NotivStyles {
    title?: string;
    description?: string;
    badge?: string;
    button?: string;
}

export { }
