<?php
/**
 * Reusable UI helpers for Nexura Admin
 */

function ui_is_partial_request(): bool
{
    return !empty($_GET['partial'])
        || (isset($_SERVER['HTTP_X_PARTIAL']) && $_SERVER['HTTP_X_PARTIAL'] === '1');
}

function ui_stat_card(string $id, string $label, string $icon, string $color = 'violet'): string
{
    $colors = [
        'violet' => 'bg-violet-500/15 text-violet-400',
        'emerald' => 'bg-emerald-500/15 text-emerald-400',
        'cyan' => 'bg-cyan-500/15 text-cyan-400',
        'amber' => 'bg-amber-500/15 text-amber-400',
        'rose' => 'bg-rose-500/15 text-rose-400',
    ];
    $iconClass = $colors[$color] ?? $colors['violet'];

    return <<<HTML
<div class="nx-stat-card rounded-2xl bg-slate-900/80 border border-slate-800 p-6 transition hover:border-slate-700">
    <div class="flex items-center justify-between mb-4">
        <span class="text-slate-400 text-sm font-medium">{$label}</span>
        <div class="w-10 h-10 rounded-xl {$iconClass} flex items-center justify-center"><i class="fas {$icon}"></i></div>
    </div>
    <p id="{$id}" class="text-3xl font-bold tracking-tight">0</p>
</div>
HTML;
}

function ui_page_header(string $title, string $subtitle = '', string $actionsHtml = ''): string
{
    $subtitleHtml = $subtitle
        ? '<p class="text-slate-400 text-sm mt-1">' . htmlspecialchars($subtitle, ENT_QUOTES) . '</p>'
        : '';

    return <<<HTML
<div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 nx-animate-in">
    <div>
        <h2 class="text-xl font-bold text-white">{$title}</h2>
        {$subtitleHtml}
    </div>
    <div class="flex flex-wrap items-center gap-2">{$actionsHtml}</div>
</div>
HTML;
}

function ui_search_input(string $id, string $placeholder = 'Search...'): string
{
    return '<input id="' . htmlspecialchars($id, ENT_QUOTES) . '" type="search" placeholder="' . htmlspecialchars($placeholder, ENT_QUOTES) . '" class="nx-input w-full sm:max-w-xs">';
}

function ui_btn(string $label, string $onclick = '', string $variant = 'primary', string $icon = ''): string
{
    $classes = [
        'primary' => 'nx-btn nx-btn-primary',
        'secondary' => 'nx-btn nx-btn-secondary',
        'danger' => 'nx-btn nx-btn-danger',
        'ghost' => 'nx-btn nx-btn-ghost',
    ];
    $class = $classes[$variant] ?? $classes['primary'];
    $iconHtml = $icon ? '<i class="fas ' . $icon . ' mr-1.5"></i>' : '';
    $click = $onclick ? ' onclick="' . htmlspecialchars($onclick, ENT_QUOTES) . '"' : '';

    return "<button type=\"button\" class=\"{$class}\"{$click}>{$iconHtml}{$label}</button>";
}

function ui_table_wrap(string $theadHtml, string $tbodyId, string $minWidth = '800px'): string
{
    return <<<HTML
<div class="nx-card overflow-hidden">
    <div class="overflow-x-auto">
        <table class="nx-table w-full min-w-[{$minWidth}]">
            <thead>{$theadHtml}</thead>
            <tbody id="{$tbodyId}"><tr><td colspan="99" class="nx-empty">Loading...</td></tr></tbody>
        </table>
    </div>
    <div id="{$tbodyId}Pagination" class="nx-pagination hidden"></div>
</div>
HTML;
}

function ui_modal_shell(string $id, string $title, string $bodyHtml): string
{
    return <<<HTML
<div id="{$id}" class="nx-modal hidden" role="dialog" aria-modal="true" aria-labelledby="{$id}Title">
    <div class="nx-modal-backdrop" data-close-modal="{$id}"></div>
    <div class="nx-modal-panel">
        <div class="flex items-center justify-between mb-4">
            <h3 id="{$id}Title" class="text-lg font-bold">{$title}</h3>
            <button type="button" class="nx-icon-btn" data-close-modal="{$id}" aria-label="Close"><i class="fas fa-times"></i></button>
        </div>
        {$bodyHtml}
    </div>
</div>
HTML;
}

function ui_error_banner(string $id = 'loadError'): string
{
    return '<div id="' . htmlspecialchars($id, ENT_QUOTES) . '" class="hidden mb-4 nx-alert nx-alert-error"></div>';
}

function ui_partial_meta(string $pageTitle, string $activeNav = ''): string
{
    $title = htmlspecialchars($pageTitle, ENT_QUOTES);
    $nav = htmlspecialchars($activeNav, ENT_QUOTES);

    return '<span data-page-title="' . $title . '" data-active-nav="' . $nav . '" class="hidden" aria-hidden="true"></span>';
}

function ui_select(string $id, array $options, string $class = 'nx-input w-full sm:max-w-[10rem]'): string
{
    $html = '<select id="' . htmlspecialchars($id, ENT_QUOTES) . '" class="' . htmlspecialchars($class, ENT_QUOTES) . '">';
    foreach ($options as $value => $label) {
        $html .= '<option value="' . htmlspecialchars((string) $value, ENT_QUOTES) . '">' . htmlspecialchars($label, ENT_QUOTES) . '</option>';
    }
    $html .= '</select>';

    return $html;
}

function ui_loading_overlay(string $id = 'pageLoader'): string
{
    return <<<HTML
<div id="{$id}" class="nx-page-loader hidden" aria-hidden="true">
    <div class="nx-spinner"></div>
    <span class="text-sm text-slate-400 mt-3">Loading...</span>
</div>
HTML;
}
