import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../../services/common-services/toast.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-toast',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './toast.component.html',
    styleUrl: './toast.component.css'
})
export class ToastComponent implements OnInit, OnDestroy {
    toasts: (Toast & { id: number; show: boolean })[] = [];
    private subscription?: Subscription;
    private nextId = 0;

    constructor(private toastService: ToastService) { }

    ngOnInit() {
        this.subscription = this.toastService.toast$.subscribe((toast) => {
            const id = this.nextId++;
            const toastWithId = { ...toast, id, show: false };
            this.toasts.push(toastWithId);

            // Trigger animation
            setTimeout(() => {
                const index = this.toasts.findIndex(t => t.id === id);
                if (index !== -1) {
                    this.toasts[index].show = true;
                }
            }, 10);

            // Auto remove after duration
            setTimeout(() => {
                this.removeToast(id);
            }, toast.duration || 3000);
        });
    }

    removeToast(id: number) {
        const index = this.toasts.findIndex(t => t.id === id);
        if (index !== -1) {
            this.toasts[index].show = false;
            // Remove from array after animation completes
            setTimeout(() => {
                this.toasts = this.toasts.filter(t => t.id !== id);
            }, 300);
        }
    }

    ngOnDestroy() {
        this.subscription?.unsubscribe();
    }

    getIcon(type: string): string {
        switch (type) {
            case 'success': return '✓';
            case 'error': return '✕';
            case 'warning': return '⚠';
            case 'info': return 'ℹ';
            default: return 'ℹ';
        }
    }
}
