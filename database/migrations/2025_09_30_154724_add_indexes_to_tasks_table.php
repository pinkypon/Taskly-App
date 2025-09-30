<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
public function up(): void
{
    Schema::table('tasks', function (Blueprint $table) {
        $table->index('due_date');
        $table->index('priority');
        $table->index('created_at');
        // $table->fullText('title');
    });
}

public function down(): void
{
    Schema::table('tasks', function (Blueprint $table) {
        $table->dropIndex('tasks_due_date_index');
        $table->dropIndex('tasks_priority_index');
        $table->dropIndex('tasks_created_at_index');
        // $table->dropFullText('title'); // for MySQL
    });
}

};